'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');

const test = require('tap').test;
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const ncp = require('ncp');

const makeContext = require('../helpers/make-context');
const packageManager = require('../../lib/package-manager');
const packageManagerTest = require('../../lib/package-manager/test');

const sandbox = path.join(os.tmpdir(), `citgm-${Date.now()}`);
const fixtures = path.join(__dirname, '..', 'fixtures');

const passFixtures = path.join(fixtures, 'omg-i-pass');
const passTemp = path.join(sandbox, 'omg-i-pass');

const failFixtures = path.join(fixtures, 'omg-i-fail');
const failTemp = path.join(sandbox, 'omg-i-fail');

const badFixtures = path.join(fixtures, 'omg-i-do-not-support-testing');
const badTemp = path.join(sandbox, 'omg-i-do-not-support-testing');

const scriptsFixtures = path.join(fixtures, 'omg-i-pass-with-scripts');
const scriptsTemp = path.join(sandbox, 'omg-i-pass-with-scripts');

const writeTmpdirFixtures = path.join(fixtures, 'omg-i-write-to-tmpdir');
const writeTmpdirTemp = path.join(sandbox, 'omg-i-write-to-tmpdir');

let packageManagers;

test('yarn-test: setup', (t) => {
  t.plan(16);
  packageManager.getPackageManagers((e, res) => {
    packageManagers = res;
    t.error(e);
  });
  mkdirp(sandbox, (err) => {
    t.error(err);
    ncp(passFixtures, passTemp, (e) => {
      t.error(e);
      t.ok(fs.existsSync(path.join(passTemp, 'package.json')));
    });
    ncp(failFixtures, failTemp, (e) => {
      t.error(e);
      t.ok(fs.existsSync(path.join(failTemp, 'package.json')));
    });
    ncp(badFixtures, badTemp, (e) => {
      t.error(e);
      t.ok(fs.existsSync(path.join(badTemp, 'package.json')));
    });
    ncp(scriptsFixtures, scriptsTemp, (e) => {
      t.error(e);
      t.ok(!fs.existsSync(path.join(scriptsTemp, '.testbuilt')));
      t.ok(fs.existsSync(path.join(scriptsTemp, 'build.js')));
      t.ok(fs.existsSync(path.join(scriptsTemp, 'package.json')));
      t.ok(fs.existsSync(path.join(scriptsTemp, 'test.js')));
    });
    ncp(writeTmpdirFixtures, writeTmpdirTemp, (e) => {
      t.error(e);
      t.ok(fs.existsSync(path.join(writeTmpdirTemp, 'package.json')));
      t.ok(fs.existsSync(path.join(writeTmpdirTemp, 'test.js')));
    });
  });
});

test('yarn-test: basic module passing', (t) => {
  const context = makeContext.npmContext(
    'omg-i-pass',
    packageManagers,
    sandbox
  );
  packageManagerTest('yarn', context, (err) => {
    t.error(err);
    t.end();
  });
});

test('yarn-test: basic module failing', (t) => {
  const context = makeContext.npmContext(
    'omg-i-fail',
    packageManagers,
    sandbox
  );
  packageManagerTest('yarn', context, (err) => {
    t.equals(err && err.message, 'The canary is dead:');
    t.end();
  });
});

test('yarn-test: basic module no test script', (t) => {
  const context = makeContext.npmContext(
    'omg-i-do-not-support-testing',
    packageManagers,
    sandbox
  );
  packageManagerTest('yarn', context, (err) => {
    t.equals(err && err.message, 'Module does not support yarn-test!');
    t.end();
  });
});

test('yarn-test: no package.json', (t) => {
  const context = makeContext.npmContext(
    'omg-i-dont-exist',
    packageManagers,
    sandbox
  );
  packageManagerTest('yarn', context, (err) => {
    t.equals(err && err.message, 'Package.json Could not be found');
    t.end();
  });
});

test('yarn-test: alternative test-path', (t) => {
  // Same test as 'basic module passing', except with alt node bin which fails.
  const context = makeContext.npmContext(
    'omg-i-pass',
    packageManagers,
    sandbox,
    {
      testPath: path.resolve(__dirname, '..', 'fixtures', 'fakenodebin')
    }
  );
  packageManagerTest('yarn', context, (err) => {
    t.equals(err && err.message, 'The canary is dead:');
    t.end();
  });
});

test('yarn-test: timeout', (t) => {
  const context = makeContext.npmContext(
    'omg-i-pass',
    packageManagers,
    sandbox,
    {
      timeoutLength: 100
    }
  );
  packageManagerTest('yarn', context, (err) => {
    t.ok(context.module.flaky, 'Module is Flaky because tests timed out');
    t.equals(err && err.message, 'Test Timed Out');
    t.end();
  });
});

test('yarn-test: module with scripts passing', (t) => {
  const context = makeContext.npmContext(
    {
      name: 'omg-i-pass-with-scripts',
      scripts: ['test-build', 'test']
    },
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly'
    }
  );
  packageManagerTest('yarn', context, (err) => {
    t.error(err);
    t.end();
  });
});

test('yarn-test: tmpdir is redirected', (t) => {
  const context = makeContext.npmContext(
    'omg-i-write-to-tmpdir',
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly'
    }
  );
  context.npmConfigTmp = writeTmpdirTemp;
  packageManagerTest('npm', context, (err) => {
    t.error(err);
    t.ok(
      fs.existsSync(
        path.join(writeTmpdirTemp, 'omg-i-write-to-tmpdir-testfile')
      ),
      'Temporary file is written into the redirected temporary directory'
    );
    t.end();
  });
});

test('yarn-test: teardown', (t) => {
  rimraf(sandbox, (err) => {
    t.error(err);
    t.end();
  });
});
