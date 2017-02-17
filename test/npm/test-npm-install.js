'use strict';
const os = require('os');
const path = require('path');
const fs = require('fs');

const test = require('tap').test;
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const ncp = require('ncp');

const npmInstall = require('../../lib/npm/install');

const sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
const fixtures = path.join(__dirname, '..', 'fixtures');
const moduleFixtures = path.join(fixtures, 'omg-i-pass');
const moduleTemp = path.join(sandbox, 'omg-i-pass');
const extraParamFixtures = path.join(fixtures, 'omg-i-pass-with-install-param');
const extraParamTemp = path.join(sandbox, 'omg-i-pass-with-install-param');
const badFixtures = path.join(fixtures, 'omg-bad-tree');
const badTemp = path.join(sandbox, 'omg-bad-tree');

test('npm-install: setup', function (t) {
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

test('npm-install: basic module', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass'
    },
    meta: {},
    options: {
      npmLevel: 'silly'
    }
  };
  npmInstall(context, function (err) {
    t.error(err);
    t.end();
  });
});

test('npm-install: extra install parameters', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass-with-install-param',
      install: ['--extra-param']
    },
    meta: {},
    options: {
      npmLevel: 'silly'
    }
  };
  npmInstall(context, function (err) {
    t.error(err);
    t.end();
  });
});

test('npm-install: no package.json', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-fail'
    },
    meta: {},
    options: {
      npmLevel: 'silly'
    }
  };
  npmInstall(context, function (err) {
    t.equals(err && err.message, 'Install Failed');
    t.end();
  });
});

test('npm-install: timeout', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass'
    },
    meta: {},
    options: {
      npmLevel: 'silly',
      timeoutLength: 100
    }
  };
  npmInstall(context, function (err) {
    t.equals(err && err.message, 'Install Timed Out');
    t.end();
  });
});

test('npm-install: failed install', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-bad-tree'
    },
    meta: {},
    options: {
      npmLevel: 'http'
    }
  };

  var expected = {
    testOutput: /^$/,
    testError: 'npm ERR! 404 Registry returned 404 for GET on'
    + ' https://registry.npmjs.org/THIS-WILL-FAIL'
  };
  npmInstall(context, function (err) {
    t.equals(err && err.message, 'Install Failed');
    t.match(context, expected, 'Install error reported');
    t.end();
  });
});

test('npm-install: teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});
