'use strict';
// FIXME not really a unit test
// FIXME npm should be stubbed
// TODO Test for local module... what does it even mean?

const os = require('os');
const path = require('path');
const fs = require('fs');

const test = require('tap').test;
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const grabProject = require('../lib/grab-project');

const sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
const fixtures = path.join(__dirname, 'fixtures');

test('grab-project: setup', function (t) {
  mkdirp(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});

test('grab-project: npm module', function (t) {
  const context = {
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
  const context = {
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
  const context = {
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
  const context = {
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
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'I-DO-NOT-EXIST'
    },
    options: {}
  };
  grabProject(context, function (err) {
    t.equals(err && err.message, 'Failure getting project from npm');
    t.end();
  });
});

test('grab-project: timeout', function (t) {
  const context = {
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
