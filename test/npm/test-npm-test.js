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
const rewire = require('rewire');

const makeContext = require('../helpers/make-context');
const packageManagerTest = rewire('../../lib/package-manager/test');

const sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
const fixtures = path.join(__dirname, '..', 'fixtures');

const passFixtures = path.join(fixtures, 'omg-i-pass');
const passTemp = path.join(sandbox, 'omg-i-pass');

const failFixtures = path.join(fixtures, 'omg-i-fail');
const failTemp = path.join(sandbox, 'omg-i-fail');

const badFixtures = path.join(fixtures, 'omg-i-do-not-support-testing');
const badTemp = path.join(sandbox, 'omg-i-do-not-support-testing');

test('npm-test: setup', function (t) {
  t.plan(7);
  mkdirp(sandbox, function (err) {
    t.error(err);
    ncp(passFixtures, passTemp, function (e) {
      t.error(e);
      t.ok(fs.existsSync(path.join(passTemp, 'package.json')));
    });
    ncp(failFixtures, failTemp, function (e) {
      t.error(e);
      t.ok(fs.existsSync(path.join(failTemp, 'package.json')));
    });
    ncp(badFixtures, badTemp, function (e) {
      t.error(e);
      t.ok(fs.existsSync(path.join(badTemp, 'package.json')));
    });
  });
});

test('npm-test: basic module passing', function (t) {
  const context = makeContext.npmContext('omg-i-pass', sandbox, {
    npmLevel: 'silly'
  });
  packageManagerTest('npm', context, function (err) {
    t.error(err);
    t.end();
  });
});

test('npm-test: basic module failing', function (t) {
  const context = makeContext.npmContext('omg-i-fail', sandbox);
  packageManagerTest('npm', context, function (err) {
    t.equals(err && err.message, 'The canary is dead:');
    t.end();
  });
});

test('npm-test: basic module no test script', function (t) {
  const context =
    makeContext.npmContext('omg-i-do-not-support-testing', sandbox);
  packageManagerTest('npm', context, function (err) {
    t.equals(err && err.message, 'Module does not support npm-test!');
    t.end();
  });
});

test('npm-test: no package.json', function (t) {
  const context = makeContext.npmContext('omg-i-dont-exist', sandbox);
  packageManagerTest('npm', context, function (err) {
    t.equals(err && err.message, 'Package.json Could not be found');
    t.end();
  });
});

// Skipped since this does not work with shell scripts
skip('npm-test: alternative test-path', function (t) {
  // Same test as 'basic module passing', except with alt node bin which fails.
  const nodeBinName = packageManagerTest.__get__('nodeBinName');
  packageManagerTest.__set__('nodeBinName', 'fake-node');
  const context = makeContext.npmContext('omg-i-pass', sandbox, {
    npmLevel: 'silly',
    testPath: path.resolve(__dirname, '..', 'fixtures', 'fakenodebin')
  });
  packageManagerTest('npm', context, function (err) {
    packageManagerTest.__set__('nodeBinName', nodeBinName);
    t.equals(err && err.message, 'The canary is dead:');
    t.end();
  });
});

test('npm-test: timeout', function (t) {
  const context = makeContext.npmContext('omg-i-pass', sandbox, {
    npmLevel: 'silly',
    timeoutLength: 100
  });
  packageManagerTest('npm', context, function (err) {
    t.ok(context.module.flaky, 'Module is Flaky because tests timed out');
    t.equals(err && err.message, 'Test Timed Out');
    t.end();
  });
});

test('npm-test: teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});
