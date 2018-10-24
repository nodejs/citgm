'use strict';
const os = require('os');
const path = require('path');
const fs = require('fs');

const tap = require('tap');
const test = tap.test;
const skip = tap.skip;
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const ncp = require('ncp');

const packageManagerInstall = require('../../lib/package-manager/install');
const makeContext = require('../helpers/make-context');

const sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
const fixtures = path.join(__dirname, '..', 'fixtures');
const moduleFixtures = path.join(fixtures, 'omg-i-pass');
const moduleTemp = path.join(sandbox, 'omg-i-pass');
const extraParamFixtures = path.join(fixtures, 'omg-i-pass-with-install-param');
const extraParamTemp = path.join(sandbox, 'omg-i-pass-with-install-param');
const badFixtures = path.join(fixtures, 'omg-bad-tree');
const badTemp = path.join(sandbox, 'omg-bad-tree');

test('yarn-install: setup', function (t) {
  t.plan(7);
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
  const context = makeContext.npmContext('omg-i-pass', sandbox);
  packageManagerInstall('yarn', context, function (err) {
    t.error(err);
    t.end();
  });
});

// Skipped because yarn does not have the same behavior.
skip('yarn-install: extra install parameters', function (t) {
  const context = makeContext.npmContext({
    name: 'omg-i-pass-with-install-param',
    install: ['--extra-param']
  }, sandbox);
  packageManagerInstall('yarn', context, function (err) {
    t.error(err);
    t.notOk(context.module.flaky, 'Module passed and is not flaky');
    t.end();
  });
});

test('yarn-install: no package.json', function (t) {
  const context = makeContext.npmContext('omg-i-fail', sandbox);
  packageManagerInstall('yarn', context, function (err) {
    t.equals(err && err.message, 'Install Failed');
    t.notOk(context.module.flaky, 'Module failed but is not flaky');
    t.end();
  });
});

test('yarn-install: timeout', function (t) {
  const context = makeContext.npmContext('omg-i-pass', sandbox, {
    timeoutLength: 100
  });
  packageManagerInstall('yarn', context, function (err) {
    t.ok(context.module.flaky, 'Module is Flaky because install timed out');
    t.equals(err && err.message, 'Install Timed Out');
    t.end();
  });
});

test('yarn-install: failed install', function (t) {
  const context = makeContext.npmContext('omg-bad-tree', sandbox, {
    npmLevel: 'http'
  });
  const expected = {
    testError: /"https:\/\/registry.yarnpkg.com\/THIS-WILL-FAIL: Not found/
  };
  packageManagerInstall('yarn', context, function (err) {
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
