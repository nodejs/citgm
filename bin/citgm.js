#!/usr/bin/env node
'use strict';

require('make-promises-safe');

const citgm = require('../lib/citgm');
const commonArgs = require('../lib/common-args');
const logger = require('../lib/out');
const reporter = require('../lib/reporter');
const update = require('../lib/update');

let mod;

const yargs = commonArgs(require('yargs'))
  .usage('citgm [options] <module>')
  .option('sha', {
    alias: 'c',
    type: 'string',
    description: 'Install module from commit-sha'
  });

const app = yargs.argv;

mod = app._[0];

const log = logger({
  level: app.verbose,
  noColor: app.noColor
});

update(log);

if (!app.su) {
  require('root-check')(); // Silently downgrade if running as root...
  // Unless --su is passed
} else {
  log.warn('root', 'Running as root! Use caution!');
}

if (!mod) {
  yargs.showHelp();
  process.exit(0);
}

const options = {
  lookup: app.lookup,
  nodedir: app.nodedir,
  testPath: app.testPath,
  level: app.verbose,
  npmLevel: app.npmLoglevel,
  timeoutLength: app.timeout,
  sha: app.sha,
  tmpDir: app.tmpDir,
  customTest: app.customTest,
  yarn: app.yarn
};

if (!citgm.windows) {
  const uidnumber = require('uid-number');
  const uid = app.uid || process.getuid();
  const gid = app.gid || process.getgid();
  uidnumber(uid, gid, (err, uid, gid) => {
    options.uid = uid;
    options.gid = gid;
    launch(mod, options);
  });
} else {
  launch(mod, options);
}

const start = new Date();
function launch(mod, options) {
  const runner = new citgm.Tester(mod, options);

  function cleanup() {
    runner.cleanup();
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
    .on('end', (module) => {
      module.duration = new Date() - start;
      reporter.logger(log, module);

      log.info('duration', `test duration: ${module.duration}ms`);
      if (app.markdown) {
        reporter.markdown(log.bypass, module);
      }
      if (app.tap) {
        const tap = typeof app.tap === 'string' ? app.tap : log.bypass;
        reporter.tap(tap, module, app.append);
      }

      if (app.junit) {
        const junit = typeof app.junit === 'string' ? app.junit : log.bypass;
        reporter.junit(junit, module, app.append);
      }

      process.removeListener('SIGINT', cleanup);
      process.removeListener('SIGHUP', cleanup);
      process.removeListener('SIGBREAK', cleanup);
      process.exit(module.error ? 1 : 0);
    })
    .run();
}
