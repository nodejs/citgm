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
var fixtures = path.join(__dirname, 'fixtures');

test('grab-project: setup', function (t) {
  mkdirp(sandbox, function (err) {
    t.error(err);
    t.end();
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
      t.end();
    });
  });
});

test('grab-project: local', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: './test/fixtures/omg-i-pass',
      type: 'local'
    },
    meta: {},
    options: {}
  };
  grabProject(context, function (err) {
    t.error(err);
    fs.stat(context.unpack, function (err, stats) {
      t.error(err);
      t.ok(stats.isFile(), 'The tar ball should exist on the system');
      t.end();
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
      t.end();
    });
  });
});

test('grab-project: local', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'omg-i-pass',
      type: 'local'
    },
    options: {}
  };
  process.chdir(fixtures);
  grabProject(context, function (err) {
    t.error(err);
    fs.stat(context.unpack, function (err, stats) {
      t.error(err);
      t.ok(stats.isFile(), 'The tar ball should exist on the system');
      process.chdir(__dirname);
      t.end();
    });
  });
});

test('grab-project: module does not exist', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'I-DO-NOT-EXIST'
    },
    options: {}
  };
  grabProject(context, function (err) {
    t.equals(err && err.message, 'Failure getting tarball');
    t.end();
  });
});

test('grab-project: timeout', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass'
    },
    meta: {},
    options: {
      npmLevel: 'silly',
      timeoutLength: 10
    }
  };
  grabProject(context, function (err) {
    t.equals(err && err.message, 'Download Timed Out');
    t.end();
  });
});

test('grab-project: teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});
