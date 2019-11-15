'use strict';

const os = require('os');
const path = require('path');
const { promisify } = require('util');

const { copy, existsSync } = require('fs-extra');
const { test } = require('tap');
const mkdirp = promisify(require('mkdirp'));
const rimraf = promisify(require('rimraf'));

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

test('yarn-test: setup', async () => {
  packageManagers = await packageManager.getPackageManagers();
  await mkdirp(sandbox);
  await Promise.all([
    copy(passFixtures, passTemp),
    copy(failFixtures, failTemp),
    copy(badFixtures, badTemp),
    copy(scriptsFixtures, scriptsTemp),
    copy(writeTmpdirFixtures, writeTmpdirTemp)
  ]);
});

test('yarn-test: basic module passing', async () => {
  const context = makeContext.npmContext(
    'omg-i-pass',
    packageManagers,
    sandbox
  );
  await packageManagerTest('yarn', context);
});

test('yarn-test: basic module failing', async (t) => {
  t.plan(1);
  const context = makeContext.npmContext(
    'omg-i-fail',
    packageManagers,
    sandbox
  );
  try {
    await packageManagerTest('yarn', context);
  } catch (err) {
    t.equals(err && err.message, 'The canary is dead:');
  }
});

test('yarn-test: basic module no test script', async (t) => {
  t.plan(1);
  const context = makeContext.npmContext(
    'omg-i-do-not-support-testing',
    packageManagers,
    sandbox
  );
  try {
    await packageManagerTest('yarn', context);
  } catch (err) {
    t.equals(err && err.message, 'Module does not support yarn-test!');
  }
});

test('yarn-test: no package.json', async (t) => {
  t.plan(1);
  const context = makeContext.npmContext(
    'omg-i-dont-exist',
    packageManagers,
    sandbox
  );
  try {
    await packageManagerTest('yarn', context);
  } catch (err) {
    t.equals(err && err.message, 'Package.json Could not be found');
  }
});

test('yarn-test: alternative test-path', async (t) => {
  t.plan(1);
  // Same test as 'basic module passing', except with alt node bin which fails.
  const context = makeContext.npmContext(
    'omg-i-pass',
    packageManagers,
    sandbox,
    {
      testPath: path.resolve(__dirname, '..', 'fixtures', 'fakenodebin')
    }
  );
  try {
    await packageManagerTest('yarn', context);
  } catch (err) {
    t.equals(err && err.message, 'The canary is dead:');
  }
});

test('yarn-test: timeout', async (t) => {
  t.plan(2);
  const context = makeContext.npmContext(
    'omg-i-pass',
    packageManagers,
    sandbox,
    {
      timeoutLength: 100
    }
  );
  try {
    await packageManagerTest('yarn', context);
  } catch (err) {
    t.notOk(context.module.flaky, 'Time out should not mark module flaky');
    t.equals(err && err.message, 'Test Timed Out');
  }
});

test('yarn-test: module with scripts passing', async () => {
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

  await packageManagerTest('yarn', context);
});

test('yarn-test: tmpdir is redirected', async (t) => {
  t.plan(1);
  const context = makeContext.npmContext(
    'omg-i-write-to-tmpdir',
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly'
    }
  );
  context.npmConfigTmp = writeTmpdirTemp;
  await packageManagerTest('yarn', context);
  t.ok(
    existsSync(path.join(writeTmpdirTemp, 'omg-i-write-to-tmpdir-testfile')),
    'Temporary file is written into the redirected temporary directory'
  );
});

test('yarn-test: teardown', async () => {
  await rimraf(sandbox);
});
