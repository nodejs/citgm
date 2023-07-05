import 'make-promises-safe';

import rootCheck from 'root-check';
import uidnumber from 'uid-number';

import { windows, Tester } from '../citgm.js';
import { commonArgs } from '../common-args.js';
import { logger } from '../out.js';
import * as reporter from '../reporter/index.js';
import async from 'async';

let mods;

const yargs = commonArgs()
  .usage('citgm [options] <module-1> <module-2> <module-n>')
  .option('sha', {
    alias: 'c',
    type: 'string',
    description: 'Install module from commit-sha, branch or tag'
  });

const app = yargs.argv;

mods = app._;
let modules = [];

const log = logger({
  level: app.verbose,
  noColor: app.noColor
});

if (!app.su) {
  rootCheck(); // Silently downgrade if running as root...
  // Unless --su is passed
} else {
  log.warn('root', 'Running as root! Use caution!');
}

if (!mods.length) {
  yargs.showHelp();
  process.exit(0);
}

const options = {
  lookup: app.lookup,
  nodedir: app.nodedir,
  testPath: app.testPath,
  level: app.verbose,
  npmLevel: app.npmLoglevel,
  timeout: app.timeout,
  sha: app.sha,
  tmpDir: app.tmpDir,
  customTest: app.customTest,
  yarn: app.yarn
};

if (!windows) {
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

function runCitgm(mod, next) {
  const start = new Date();
  const runner = new Tester(mod, options);
  let bailed = false;

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
          `done - the test suite for ${result.name} version ${result.version} failed`
        );
      } else {
        log.info(
          `${result.name} done`,
          `done - the test suite for ${result.name} version ${result.version} passed.`
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

function runTask(mod, next) {
  runCitgm(mod, next);
}

function launch() {
  const collection = mods;

  const q = async.queue(runTask, app.parallel || 1);
  q.push(collection);
  function done(exitCode = 0) {
    q.kill();
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

    const hasFailures = reporter.util.hasFailures(modules) ? 1 : 0;
    process.exit(hasFailures || exitCode);
  }

  function abort() {
    q.pause();
    q.kill();
    process.removeListener('SIGINT', abort);
    process.removeListener('SIGHUP', abort);
    process.removeListener('SIGBREAK', abort);
    done(1);
  }

  q.drain(done);

  process.on('SIGINT', abort);
  process.on('SIGHUP', abort);
  process.on('SIGBREAK', abort);
}
