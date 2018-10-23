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

test('grab-project: setup', (t) => {
  mkdirp(sandbox, (err) => {
    t.error(err);
    t.end();
  });
});

test('grab-project: npm module', (t) => {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'omg-i-pass'
    },
    meta: {},
    options: {}
  };
  grabProject(context, (err) => {
    t.error(err);
    fs.stat(context.unpack, (err, stats) => {
      t.error(err);
      t.ok(stats.isFile(), 'The tar ball should exist on the system');
      t.end();
    });
  });
});

test('grab-project: local', (t) => {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: './test/fixtures/omg-i-pass',
      type: 'directory'
    },
    meta: {},
    options: {}
  };
  grabProject(context, (err) => {
    t.error(err);
    fs.stat(context.unpack, (err, stats) => {
      t.error(err);
      t.ok(stats.isFile(), 'The tar ball should exist on the system');
      t.end();
    });
  });
});

test('grab-project: lookup table', (t) => {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'lodash'
    },
    meta: {},
    options: {}
  };
  grabProject(context, (err) => {
    t.error(err);
    fs.stat(context.unpack, (err, stats) => {
      t.error(err);
      t.ok(stats.isFile(), 'The tar ball should exist on the system');
      t.end();
    });
  });
});

test('grab-project: local', (t) => {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'omg-i-pass',
      type: 'directory'
    },
    options: {}
  };
  process.chdir(fixtures);
  grabProject(context, (err) => {
    t.error(err);
    fs.stat(context.unpack, (err, stats) => {
      t.error(err);
      t.ok(stats.isFile(), 'The tar ball should exist on the system');
      process.chdir(__dirname);
      t.end();
    });
  });
});

test('grab-project: module does not exist', (t) => {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'I-DO-NOT-EXIST'
    },
    options: {}
  };
  grabProject(context, (err) => {
    t.equals(err && err.message, 'Failure getting project from npm');
    t.end();
  });
});

test('grab-project: timeout', (t) => {
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
  grabProject(context, (err) => {
    t.equals(err && err.message, 'Download Timed Out');
    t.end();
  });
});

test('grab-project: teardown', (t) => {
  rimraf(sandbox, (err) => {
    t.error(err);
    t.end();
  });
});
