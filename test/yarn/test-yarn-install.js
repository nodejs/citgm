'use strict';
const os = require('os');
const path = require('path');
const fs = require('fs');

const test = require('tap').test;
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const ncp = require('ncp');

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

test('yarn-install: setup', function (t) {
  t.plan(8);
  packageManager.getPackageManagers((e, res) => {
    packageManagers = res;
    t.error(e);
  });
  mkdirp(sandbox, function (err) {
    t.error(err);
    ncp(moduleFixtures, moduleTemp, function (e) {
      t.error(e);
      t.ok(fs.existsSync(path.join(moduleTemp, 'package.json')));
    });
    ncp(extraParamFixtures, extraParamTemp, function (e) {
      t.error(e);
      t.ok(fs.existsSync(path.join(moduleTemp, 'package.json')));
    });
    ncp(badFixtures, badTemp, function (e) {
      t.error(e);
      t.ok(fs.existsSync(path.join(badTemp, 'package.json')));
    });
  });
});

test('yarn-install: basic module', function (t) {
  const context = makeContext.npmContext('omg-i-pass', packageManagers,
    sandbox);
  packageManagerInstall('yarn', context, function (err) {
    context.testOutput = context.testOutput.toString();
    context.testError = context.testError.toString();
    t.error(err);
    t.end();
  });
});

test('yarn-install: no package.json', function (t) {
  const context = makeContext.npmContext('omg-i-fail', packageManagers,
    sandbox);
  packageManagerInstall('yarn', context, function (err) {
    context.testOutput = context.testOutput.toString();
    context.testError = context.testError.toString();
    t.equals(err && err.message, 'Install Failed');
    t.notOk(context.module.flaky, 'Module failed but is not flaky');
    t.end();
  });
});

test('yarn-install: timeout', function (t) {
  const context = makeContext.npmContext('omg-i-pass', packageManagers,
    sandbox, {
      timeoutLength: 100
    });
  packageManagerInstall('yarn', context, function (err) {
    context.testOutput = context.testOutput.toString();
    context.testError = context.testError.toString();
    t.ok(context.module.flaky, 'Module is Flaky because install timed out');
    t.equals(err && err.message, 'Install Timed Out');
    t.end();
  });
});

test('yarn-install: failed install', function (t) {
  const context = makeContext.npmContext('omg-bad-tree', packageManagers,
    sandbox);
  const expected = {
    testError: /\/THIS-WILL-FAIL: Not found/
  };
  packageManagerInstall('yarn', context, function (err) {
    context.testOutput = context.testOutput.toString();
    context.testError = context.testError.toString();
    t.notOk(context.module.flaky, 'Module failed is not flaky');
    t.equals(err && err.message, 'Install Failed');
    t.match(context, expected, 'Install error reported');
    t.end();
  });
});

test('yarn-install: teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});
