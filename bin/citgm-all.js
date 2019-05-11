#!/usr/bin/env node
'use strict';

require('make-promises-safe');

const os = require('os');

const async = require('async');

const checkTags = require('../lib/check-tags');
const citgm = require('../lib/citgm');
const commonArgs = require('../lib/common-args');
const getLookup = require('../lib/lookup').get;
const isMatch = require('../lib/match-conditions');
const logger = require('../lib/out');
const reporter = require('../lib/reporter');
const update = require('../lib/update');

const yargs = commonArgs(require('yargs'))
  .usage('citgm-all [options]')
  .option('fail-flaky', {
    alias: 'f',
    type: 'boolean',
    description: 'Ignore flaky flags. Do not ignore any failures.'
  })
  .option('parallel', {
    alias: 'j',
    type: 'number',
    description: 'Number of tests to run in parallel'
  })
  .option('autoParallel', {
    alias: 'J',
    type: 'boolean',
    description: 'Auto detect number of cores to use to run tests in parallel'
  })
  .option('includeTags', {
    type: 'array',
    description: 'Define which tags from the lookup to run'
  })
  .option('excludeTags', {
    type: 'array',
    description: 'Define which tags from the lookup to skip'
  })
  .example(
    'citgm-all -t /path/to/output.tap',
    'Write test results as tap to file.'
  )
  .example('citgm-all -l /path/to/lookup.json', 'Test a custom set of modules.')
  .example('citgm-all --includeTags express', 'Only test express.')
  .example('citgm-all --excludeTags native', "Don't test native modules.");

const app = yargs.argv;

const log = logger({
  level: app.verbose,
  noColor: app.noColor
});

update(log);

if (!app.su) {
  require('root-check')(); // Silently downgrade if running as root... Unless --su is passed
} else {
  log.warn('root', 'Running as root! Use caution!');
}

const options = {
  lookup: app.lookup,
  nodedir: app.nodedir,
  testPath: app.testPath,
  failFlaky: app.failFlaky,
  level: app.verbose,
  npmLevel: app.npmLoglevel,
  timeoutLength: app.timeout,
  tmpDir: app.tmpDir,
  customTest: app.customTest,
  yarn: app.yarn,
  includeTags: app.includeTags || [],
  excludeTags: app.excludeTags || []
};

if (options.includeTags.length) {
  log.info(
    'includeTags',
    `Only running tests matching these tags: ${app.includeTags}`
  );
}
if (options.excludeTags.length) {
  log.info(
    'excludeTags',
    `Not running tests matching these tags: ${app.excludeTags}`
  );
}

const lookup = getLookup(options);
if (!lookup) {
  log.error('the json file cannot be found or there is an error in the file!');
  process.exit(1);
}

const cpus = os.cpus().length;
if (app.autoParallel || (app.parallel && app.parallel > cpus)) {
  app.parallel = cpus;
  log.info('cores', `running tests using ${app.parallel} cores`);
}
if (app.parallel && app.parallel + 1 > process.getMaxListeners()) {
  process.setMaxListeners(app.parallel + 1);
}

if (!citgm.windows) {
  const uidnumber = require('uid-number');
  const uid = app.uid || process.getuid();
  const gid = app.gid || process.getgid();
  uidnumber(uid, gid, (err, uid, gid) => {
    options.uid = uid;
    options.gid = gid;
    launch();
  });
} else {
  launch();
}

const modules = [];

function runCitgm(mod, name, next) {
  if (isMatch(mod.skip)) {
    modules.push({
      name,
      skipped: true
    });
    log.info('skipped', name);
    return next();
  }

  const start = new Date();
  const runner = new citgm.Tester(name, options);
  let bailed = false;

  if (checkTags(options, mod, name, log)) {
    return next(); // Skip this module
  }

  function cleanup() {
    bailed = true;
    runner.cleanup();
    process.removeListener('SIGINT', cleanup);
    process.removeListener('SIGHUP', cleanup);
    process.removeListener('SIGBREAK', cleanup);
  }

  process.on('SIGINT', cleanup);
  process.on('SIGHUP', cleanup);
  process.on('SIGBREAK', cleanup);

  runner
    .on('start', (name) => {
      log.info('starting', name);
    })
    .on('fail', (err) => {
      log.error('failure', err.message);
    })
    .on('data', (type, key, message) => {
      log[type](key, message);
    })
    .on('end', (result) => {
      result.duration = new Date() - start;
      log.info('duration', `test duration: ${result.duration}ms`);
      if (result.error) {
        log.error(
          `${result.name} done`,
          `done - the test suite for ${result.name} version ${
            result.version
          } failed`
        );
      } else {
        log.info(
          `${result.name} done`,
          `done - the test suite for ${result.name} version ${
            result.version
          } passed.`
        );
      }
      modules.push(result);
      if (!bailed) {
        process.removeListener('SIGINT', cleanup);
        process.removeListener('SIGHUP', cleanup);
        process.removeListener('SIGBREAK', cleanup);
      }
      return next(bailed);
    })
    .run();
}

function runTask(task, next) {
  runCitgm(task.mod, task.name, next);
}

function mapCallback(name) {
  return { name: name, mod: lookup[name] };
}

function launch() {
  const collection = Object.keys(lookup).map(mapCallback);

  const q = async.queue(runTask, app.parallel || 1);
  q.push(collection);
  function done() {
    q.drain = null;
    reporter.logger(log, modules);

    if (app.markdown) {
      reporter.markdown(log.bypass, modules);
    }

    if (app.tap) {
      // If tap is a string it should be a path to write output to
      // If not use `log.bypass` which is currently process.stdout.write
      // TODO check that we can write to that path, perhaps require a flag to
      // Overwrite
      const tap = typeof app.tap === 'string' ? app.tap : log.bypass;
      reporter.tap(tap, modules, app.append);
    }

    if (app.junit) {
      const junit = typeof app.junit === 'string' ? app.junit : log.bypass;
      reporter.junit(junit, modules, app.append);
    }

    process.exit(reporter.util.hasFailures(modules));
  }

  function abort() {
    q.pause();
    q.kill();
    process.exitCode = 1;
    process.removeListener('SIGINT', abort);
    process.removeListener('SIGHUP', abort);
    process.removeListener('SIGBREAK', abort);
    done();
  }

  q.drain = done;

  process.on('SIGINT', abort);
  process.on('SIGHUP', abort);
  process.on('SIGBREAK', abort);
}
