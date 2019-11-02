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

test('npm-install: setup', async () => {
  packageManagers = await packageManager.getPackageManagers();
  await mkdirp(sandbox);
  await Promise.all([
    copy(moduleFixtures, moduleTemp),
    copy(extraParamFixtures, extraParamTemp),
    copy(badFixtures, badTemp)
  ]);
});

test('npm-install: basic module', async () => {
  const context = makeContext.npmContext(
    'omg-i-pass',
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly'
    }
  );
  await packageManagerInstall('npm', context);
});

test('npm-install: extra install parameters', async (t) => {
  t.plan(1);
  const context = makeContext.npmContext(
    {
      name: 'omg-i-pass-with-install-param',
      install: ['--extra-param']
    },
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly'
    }
  );
  await packageManagerInstall('npm', context);
  t.notOk(context.module.flaky, 'Module passed and is not flaky');
});

test('npm-install: no package.json', async (t) => {
  t.plan(2);
  const context = makeContext.npmContext(
    'omg-i-fail',
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly'
    }
  );
  try {
    await packageManagerInstall('npm', context);
  } catch (err) {
    t.equals(err && err.message, 'Install Failed');
    t.notOk(context.module.flaky, 'Module failed but is not flaky');
  }
});

test('npm-install: timeout', async (t) => {
  t.plan(2);
  const context = makeContext.npmContext(
    'omg-i-pass',
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly',
      timeoutLength: 100
    }
  );
  try {
    await packageManagerInstall('npm', context);
  } catch (err) {
    t.notOk(context.module.flaky, 'Time out should not mark module flaky');
    t.equals(err && err.message, 'Install Timed Out');
  }
});

test('npm-install: failed install', async (t) => {
  t.plan(3);
  const context = makeContext.npmContext(
    'omg-bad-tree',
    packageManagers,
    sandbox,
    {
      npmLevel: 'http'
    }
  );
  const expected = {
    testOutput: /^$/,
    testError: /npm ERR! 404 Not [Ff]ound\s*(:)? .*THIS-WILL-FAIL(@0\.0\.1)?/
  };
  try {
    await packageManagerInstall('npm', context);
  } catch (err) {
    t.notOk(context.module.flaky, 'Module failed is not flaky');
    t.equals(err && err.message, 'Install Failed');
    t.match(context, expected, 'Install error reported');
  }
});

test('npm-install: teardown', async () => {
  await rimraf(sandbox);
});
