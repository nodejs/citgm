'use strict';
var os = require('os');
var path = require('path');
var fs = require('fs');

var test = require('tap').test;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var ncp = require('ncp');

var npmSetup = require('../lib/npm/setup');

var sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
var fixtures = path.join(__dirname, 'fixtures');
var moduleFixtures = path.join(fixtures, 'omg-i-pass');
var moduleTemp = path.join(sandbox, 'omg-i-pass');

test('npm-setup: setup', function (t) {
  mkdirp(sandbox, function (err) {
    t.error(err);
    ncp(moduleFixtures, moduleTemp, function (e) {
      t.error(e);
      t.ok(fs.existsSync(path.join(moduleTemp, 'package.json')));
      t.done();
    })
  });
});

test('npm-setup: basic module', function (t) {
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
  npmSetup(context, function (err) {
    t.error(err);
    t.done();
  });
});

test('npm-setup: no package.json', function (t) {
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
  npmSetup(context, function (err) {
    t.equals(err.message, 'Install Failed');
    t.done();
  });
});

test('npm-setup: teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.done();
  });
});
