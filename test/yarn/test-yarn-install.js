'use strict';

const os = require('os');
const path = require('path');
const { promisify } = require('util');

const { copy } = require('fs-extra');
const { test } = require('tap');
const mkdirp = promisify(require('mkdirp'));
const rimraf = promisify(require('rimraf'));

const packageManager = require('../../lib/package-manager');
const packageManagerInstall = require('../../lib/package-manager/install');
const makeContext = require('../helpers/make-context');

const sandbox = path.join(os.tmpdir(), `citgm-${Date.now()}`);
const fixtures = path.join(__dirname, '..', 'fixtures');
const moduleFixtures = path.join(fixtures, 'omg-i-pass');
const moduleTemp = path.join(sandbox, 'omg-i-pass');
const extraParamFixtures = path.join(fixtures, 'omg-i-pass-with-install-param');
const extraParamTemp = path.join(sandbox, 'omg-i-pass-with-install-param');
const badFixtures = path.join(fixtures, 'omg-bad-tree');
const badTemp = path.join(sandbox, 'omg-bad-tree');

let packageManagers;

test('yarn-install: setup', async () => {
  packageManagers = await packageManager.getPackageManagers();
  await mkdirp(sandbox);
  await Promise.all([
    copy(moduleFixtures, moduleTemp),
    copy(extraParamFixtures, extraParamTemp),
    copy(badFixtures, badTemp)
  ]);
});

test('yarn-install: basic module', async () => {
  const context = makeContext.npmContext(
    'omg-i-pass',
    packageManagers,
    sandbox
  );
  await packageManagerInstall('yarn', context);
});

test('yarn-install: no package.json', async (t) => {
  t.plan(2);
  const context = makeContext.npmContext(
    'omg-i-fail',
    packageManagers,
    sandbox
  );
  try {
    await packageManagerInstall('yarn', context);
  } catch (err) {
    t.equals(err && err.message, 'Install Failed');
    t.notOk(context.module.flaky, 'Module failed but is not flaky');
  }
});

test('yarn-install: timeout', async (t) => {
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
    await packageManagerInstall('yarn', context);
  } catch (err) {
    t.notOk(context.module.flaky, 'Time out should not mark module flaky');
    t.equals(err && err.message, 'Install Timed Out');
  }
});

test('yarn-install: failed install', async (t) => {
  t.plan(3);
  const context = makeContext.npmContext(
    'omg-bad-tree',
    packageManagers,
    sandbox
  );
  const expected = {
    testError: /\/THIS-WILL-FAIL: Not found/
  };
  try {
    await packageManagerInstall('yarn', context);
  } catch (err) {
    t.notOk(context.module.flaky, 'Module failed is not flaky');
    t.equals(err && err.message, 'Install Failed');
    t.match(context, expected, 'Install error reported');
  }
});

test('yarn-install: teardown', async () => {
  await rimraf(sandbox);
});
