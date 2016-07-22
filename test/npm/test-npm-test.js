'use strict';
var os = require('os');
var path = require('path');
var fs = require('fs');

var test = require('tap').test;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var ncp = require('ncp');

var npmTest = require('../../lib/npm/test');

var sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
var fixtures = path.join(__dirname, '..', 'fixtures');

var passFixtures = path.join(fixtures, 'omg-i-pass');
var passTemp = path.join(sandbox, 'omg-i-pass');

var failFixtures = path.join(fixtures, 'omg-i-fail');
var failTemp = path.join(sandbox, 'omg-i-fail');

var badFixtures = path.join(fixtures, 'omg-i-do-not-support-testing');
var badTemp = path.join(sandbox, 'omg-i-do-not-support-testing');

var customScript = path.join(fixtures, 'example-test-script-passing.sh');

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
  npmTest(context, function (err) {
    t.error(err);
    t.end();
  });
});

test('npm-test: basic module failing', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-fail'
    },
    meta: {},
    options: {}
  };
  npmTest(context, function (err) {
    t.equals(err && err.message, 'The canary is dead:');
    t.end();
  });
});

test('npm-test: basic module no test script', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-do-not-support-testing'
    },
    meta: {},
    options: {}
  };
  npmTest(context, function (err) {
    t.equals(err && err.message, 'Module does not support npm-test!');
    t.end();
  });
});

test('npm-test: no package.json', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-dont-exist'
    },
    meta: {},
    options: {}
  };
  npmTest(context, function (err) {
    t.equals(err && err.message, 'Package.json Could not be found');
    t.end();
  });
});

test('npm-test: custom script', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass'
    },
    meta: {},
    options: {
      npmLevel: 'silly',
      script: customScript
    }
  };
  npmTest(context, function (err) {
    t.error(err);
    t.end();
  });
});

test('npm-test: custom script does not exist', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass'
    },
    meta: {},
    options: {
      npmLevel: 'silly',
      script: './i/do/not/exist.lol'
    }
  };
  npmTest(context, function (err) {
    t.match(err, /ENOENT/, 'we should receive an error including ENOENT');
    t.end();
  });
});

test('npm-test: alternative test-path', function (t) {
  // Same test as 'basic module passing', except with alt node bin which fails.
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass'
    },
    meta: {},
    options: {
      npmLevel: 'silly',
      testPath: path.resolve(__dirname, '..', 'fixtures', 'fakenodebin')
    }
  };
  npmTest(context, function (err) {
    t.equals(err && err.message, 'The canary is dead:');
    t.end();
  });
});

test('npm-test: teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});
