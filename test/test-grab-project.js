'use strict';
// FIXME not really a unit test
// FIXME npm should be stubbed
// TODO Test for local module... what does it even mean?

var os = require('os');
var path = require('path');
var fs = require('fs');

var test = require('tap').test;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var grabProject = require('../lib/grab-project');

var sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());

test('grab-project: setup', function (t) {
  mkdirp(sandbox, function (err) {
    t.error(err);
    t.done();
  });
});

test('grab-project: npm module', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'omg-i-pass'
    },
    meta: {},
    options: {}
  };
  grabProject(context, function (err) {
    t.error(err);
    fs.stat(context.unpack, function (err, stats) {
      t.error(err);
      t.ok(stats.isFile(), 'The tar ball should exist on the system');
      t.done();
    });
  });
});

test('grab-project: lookup table', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'lodash'
    },
    meta: {},
    options: {}
  };
  grabProject(context, function (err) {
    t.error(err);
    fs.stat(context.unpack, function (err, stats) {
      t.error(err);
      t.ok(stats.isFile(), 'The tar ball should exist on the system');
      t.done();
    });
  });
});

test('grab-project: teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.done();
  });
});
