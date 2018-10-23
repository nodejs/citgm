'use strict';
const os = require('os');
const path = require('path');
const fs = require('fs');

const test = require('tap').test;
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const ncp = require('ncp');
const rewire = require('rewire');

const makeContext = require('../helpers/make-context');
const packageManager = require('../../lib/package-manager');
const packageManagerTest = rewire('../../lib/package-manager/test');

const sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
const fixtures = path.join(__dirname, '..', 'fixtures');

const passFixtures = path.join(fixtures, 'omg-i-pass');
const passTemp = path.join(sandbox, 'omg-i-pass');

const failFixtures = path.join(fixtures, 'omg-i-fail');
const failTemp = path.join(sandbox, 'omg-i-fail');

const badFixtures = path.join(fixtures, 'omg-i-do-not-support-testing');
const badTemp = path.join(sandbox, 'omg-i-do-not-support-testing');

let packageManagers;

test('npm-test: setup', (t) => {
  t.plan(8);
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
  });
});

test('npm-test: basic module passing', (t) => {
  const context = makeContext.npmContext('omg-i-pass', packageManagers,
    sandbox, {
      npmLevel: 'silly'
    });
  packageManagerTest('npm', context, (err) => {
    t.error(err);
    t.end();
  });
});

test('npm-test: basic module failing', (t) => {
  const context = makeContext.npmContext('omg-i-fail', packageManagers,
    sandbox);
  packageManagerTest('npm', context, (err) => {
    t.equals(err && err.message, 'The canary is dead:');
    t.end();
  });
});

test('npm-test: basic module no test script', (t) => {
  const context =
    makeContext.npmContext('omg-i-do-not-support-testing', packageManagers,
      sandbox);
  packageManagerTest('npm', context, (err) => {
    t.equals(err && err.message, 'Module does not support npm-test!');
    t.end();
  });
});

test('npm-test: no package.json', (t) => {
  const context = makeContext.npmContext('omg-i-dont-exist', packageManagers,
    sandbox);
  packageManagerTest('npm', context, (err) => {
    t.equals(err && err.message, 'Package.json Could not be found');
    t.end();
  });
});

test('npm-test: alternative test-path', (t) => {
  // Same test as 'basic module passing', except with alt node bin which fails.
  const nodeBinName = packageManagerTest.__get__('nodeBinName');
  packageManagerTest.__set__('nodeBinName', 'fake-node');
  const context = makeContext.npmContext('omg-i-pass', packageManagers,
    sandbox, {
      npmLevel: 'silly',
      testPath: path.resolve(__dirname, '..', 'fixtures', 'fakenodebin')
    });
  packageManagerTest('npm', context, (err) => {
    packageManagerTest.__set__('nodeBinName', nodeBinName);
    t.equals(err && err.message, 'The canary is dead:');
    t.end();
  });
});

test('npm-test: timeout', (t) => {
  const context = makeContext.npmContext('omg-i-pass', packageManagers,
    sandbox, {
      npmLevel: 'silly',
      timeoutLength: 100
    });
  packageManagerTest('npm', context, (err) => {
    t.ok(context.module.flaky, 'Module is Flaky because tests timed out');
    t.equals(err && err.message, 'Test Timed Out');
    t.end();
  });
});

test('npm-test: teardown', (t) => {
  rimraf(sandbox, (err) => {
    t.error(err);
    t.end();
  });
});
