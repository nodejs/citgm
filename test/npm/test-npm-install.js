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

test('npm-install: setup', (t) => {
  t.plan(8);
  packageManager.getPackageManagers((e, res) => {
    packageManagers = res;
    t.error(e);
  });
  mkdirp(sandbox, (err) => {
    t.error(err);
    ncp(moduleFixtures, moduleTemp, (e) => {
      t.error(e);
      t.ok(fs.existsSync(path.join(moduleTemp, 'package.json')));
    });
    ncp(extraParamFixtures, extraParamTemp, (e) => {
      t.error(e);
      t.ok(fs.existsSync(path.join(moduleTemp, 'package.json')));
    });
    ncp(badFixtures, badTemp, (e) => {
      t.error(e);
      t.ok(fs.existsSync(path.join(badTemp, 'package.json')));
    });
  });
});

test('npm-install: basic module', (t) => {
  const context = makeContext.npmContext(
    'omg-i-pass',
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly'
    }
  );
  packageManagerInstall('npm', context, (err) => {
    t.error(err);
    t.end();
  });
});

test('npm-install: extra install parameters', (t) => {
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
  packageManagerInstall('npm', context, (err) => {
    t.error(err);
    t.notOk(context.module.flaky, 'Module passed and is not flaky');
    t.end();
  });
});

test('npm-install: no package.json', (t) => {
  const context = makeContext.npmContext(
    'omg-i-fail',
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly'
    }
  );
  packageManagerInstall('npm', context, (err) => {
    t.equals(err && err.message, 'Install Failed');
    t.notOk(context.module.flaky, 'Module failed but is not flaky');
    t.end();
  });
});

test('npm-install: timeout', (t) => {
  const context = makeContext.npmContext(
    'omg-i-pass',
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly',
      timeoutLength: 100
    }
  );
  packageManagerInstall('npm', context, (err) => {
    t.ok(context.module.flaky, 'Module is Flaky because install timed out');
    t.equals(err && err.message, 'Install Timed Out');
    t.end();
  });
});

test('npm-install: failed install', (t) => {
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
  packageManagerInstall('npm', context, (err) => {
    t.notOk(context.module.flaky, 'Module failed is not flaky');
    t.equals(err && err.message, 'Install Failed');
    t.match(context, expected, 'Install error reported');
    t.end();
  });
});

test('npm-install: teardown', (t) => {
  rimraf(sandbox, (err) => {
    t.error(err);
    t.end();
  });
});
