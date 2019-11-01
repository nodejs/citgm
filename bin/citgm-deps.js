'use strict';

require('make-promises-safe');

const citgm = require('../lib/citgm');
const commonArgs = require('../lib/common-args');
const logger = require('../lib/out');
const reporter = require('../lib/reporter');
const update = require('../lib/update');

const tempDirectory = require('../lib/temp-directory');
const spawn = require('../lib/spawn');
const packageManager = require('../lib/package-manager');
const async = require('async');

let mod;

const yargs = commonArgs(require('yargs'))
  .usage('citgm-deps [options] <module>')
  .option('parallel', {
    alias: 'j',
    type: 'number',
    description: 'Number of tests to run in parallel'
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

const runner = new citgm.Tester(mod, options);
let pack, dependencies;

// Fisrt npm install in a temp directory and grab all the dependencies and their version in semver format

let setup = async () => {
  await tempDirectory.create(runner);
  const { npm, yarn } = await packageManager.getPackageManagers();
  runner.npmPath = npm;
  runner.yarnPath = yarn;
  pack = mod.split('@')[0]; //The actual package
  await doInstall();
  await findDependencies();
  await cleanup();

  if (dependencies === undefined) {
    console.log('Module has no dependencies');
  } else {
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
  }
};

let doInstall = async () => {
  // Use a child process to npm install in the tmp directory
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['i', '--prefix', runner.path, pack], options);
    child.on('close', (code) => {
      console.log('exited with code: ', code);
      if (code > 0) {
        console.log('Fail on install');
        reject();
      } else {
        resolve();
      }
    });
  });
};

let findDependencies = async () => {
  let pathToMod = `${runner.path}/node_modules/${pack}/package.json`;
  console.log('module path: ', pathToMod);
  let test = require(pathToMod);
  dependencies = test.dependencies;
};

let cleanup = async () => {
  await tempDirectory.remove(runner);
};

setup();

const modules = [];

let runCitgm = async (mod, name, next) => {
  const runner = new citgm.Tester(mod, name, options); //Async the runner so it will await each module before running

  const start = new Date();
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
};

let runTask = (task, next) => {
  runCitgm(task.mod, task.name, next);
};

let mapCallback = (dep) => {
  return { name: dep, mod: `${dep}@${dependencies[dep]}` };
};

let launch = () => {
  const q = async.queue(runTask, app.parallel || 1);

  let collection = Object.keys(dependencies).map(mapCallback);
  q.push(collection);

  let done = () => {
    q.kill();
    reporter.logger(log, modules);
    if (app.markdown) {
      reporter.markdown(log.bypass, modules);
    }

    if (app.tap) {
      const tap = typeof app.tap === 'string' ? app.tap : log.bypass;
      reporter.tap(tap, modules, app.append);
    }

    if (app.junit) {
      const junit = typeof app.junit === 'string' ? app.junit : log.bypass;
      reporter.junit(junit, modules, app.append);
    }

    process.exit(reporter.util.hasFailures(modules));
  };
  function abort() {
    q.pause();
    q.kill();
    process.exitCode = 1;
    process.removeListener('SIGINT', abort);
    process.removeListener('SIGHUP', abort);
    process.removeListener('SIGBREAK', abort);
    done();
  }

  q.drain(done);

  process.on('SIGINT', abort);
  process.on('SIGHUP', abort);
  process.on('SIGBREAK', abort);
};
