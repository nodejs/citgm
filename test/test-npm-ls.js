'use strict';
var os = require('os');
var path = require('path');
var fs = require('fs');

var test = require('tap').test;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var ncp = require('ncp');

var ls = require('../lib/npm/ls');

var sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
var fixtures = path.join(__dirname, 'fixtures');

var passFixtures = path.join(fixtures, 'npm-ls-pass');
var passTemp = path.join(sandbox, 'npm-ls-pass');

var failFixtures = path.join(fixtures, 'npm-ls-fail');
var failTemp = path.join(sandbox, 'npm-ls-fail');

test('npm-test: setup', function (t) {
  t.plan(5);
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
  });
});

test('npm-test: basic module passing', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'npm-ls-pass'
    },
    meta: {},
    options: {
      npmLevel: 'silly'
    }
  };
  ls(context, function (err) {
    t.error(err);
    t.done();
  });
});

test('npm-test: basic module failing', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'npm-ls-fail'
    },
    meta: {},
    options: {}
  };
  ls(context, function (err) {
    t.equals(err.message, 'Dependency tree is incorrect.');
    t.done();
  });
});

// test('npm-test: custom script does not exist', function (t) {
//   var context = {
//     emit: function() {},
//     path: sandbox,
//     module: {
//       name: 'omg-i-pass'
//     },
//     meta: {},
//     options: {
//       npmLevel: 'silly',
//       script: './i/do/not/exist.lol'
//     }
//   };
//   npmTest(context, function (err) {
//     t.match(err, /ENOENT/, 'we should receive an error including ENOENT');
//     t.done();
//   });
// });

test('npm-test: teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.done();
  });
});
