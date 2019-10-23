'use strict';
// FIXME not really a unit test
// FIXME npm should be stubbed
// TODO Test for local module... what does it even mean?

const os = require('os');
const path = require('path');
const { promisify } = require('util');

const { stat } = require('fs-extra');
const { test } = require('tap');
const mkdirp = promisify(require('mkdirp'));
const rimraf = promisify(require('rimraf'));

const grabProject = require('../lib/grab-project');

const sandbox = path.join(os.tmpdir(), `citgm-${Date.now()}`);
const fixtures = path.join(__dirname, 'fixtures');

test('grab-project: setup', async () => {
  await mkdirp(sandbox);
});

test('grab-project: npm module', async (t) => {
  t.plan(1);
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'omg-i-pass'
    },
    meta: {},
    options: {}
  };
  await grabProject(context);
  const stats = await stat(context.unpack);
  t.ok(stats.isFile(), 'The tar ball should exist on the system');
});

test('grab-project: local', async (t) => {
  t.plan(1);
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
  await grabProject(context);
  const stats = await stat(context.unpack);
  t.ok(stats.isFile(), 'The tar ball should exist on the system');
});

test('grab-project: lookup table', async (t) => {
  t.plan(1);
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'lodash'
    },
    meta: {},
    options: {}
  };
  await grabProject(context);
  const stats = await stat(context.unpack);
  t.ok(stats.isFile(), 'The tar ball should exist on the system');
});

test('grab-project: local', async (t) => {
  t.plan(1);
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
  await grabProject(context);
  const stats = await stat(context.unpack);
  t.ok(stats.isFile(), 'The tar ball should exist on the system');
  process.chdir(__dirname);
});

test('grab-project: module does not exist', async (t) => {
  t.plan(2);
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      raw: 'I-DO-NOT-EXIST'
    },
    options: {}
  };
  try {
    await grabProject(context);
  } catch (err) {
    t.ok(err);
    t.match(err.message, /^Failure getting project from npm/);
  }
});

test('grab-project: use git clone', async (t) => {
  t.plan(1);
  const context = {
    emit: function() {},
    path: path.join(sandbox, 'git-clone'),
    module: {
      useGitClone: true,
      name: 'omg-i-pass',
      raw: 'https://github.com/MylesBorins/omg-i-pass.git',
      ref: 'v3.0.0'
    },
    options: {}
  };
  await grabProject(context);
  const stats = await stat(path.join(context.path, 'omg-i-pass/package.json'));
  t.ok(stats.isFile(), 'The project must be cloned locally');
});

test('grab-project: fail with bad ref', async (t) => {
  t.plan(1);
  const context = {
    emit: function() {},
    path: path.join(sandbox, 'git-bad-ref'),
    module: {
      useGitClone: true,
      name: 'omg-i-pass',
      raw: 'https://github.com/MylesBorins/omg-i-pass.git',
      ref: 'bad-git-ref'
    },
    options: {}
  };
  try {
    await grabProject(context);
  } catch (err) {
    t.match(
      err.message,
      /^Command failed\b.+\bgit fetch --depth=1 origin bad-git-ref/
    );
  }
});

test('grab-project: timeout', async (t) => {
  t.plan(1);
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
  try {
    await grabProject(context);
  } catch (err) {
    t.equals(err && err.message, 'Download Timed Out');
  }
});

test('grab-project: teardown', async () => {
  await rimraf(sandbox);
});
