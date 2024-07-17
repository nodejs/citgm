// FIXME not really a unit test
// FIXME npm should be stubbed
// TODO Test for local module... what does it even mean?

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import { promises as fs } from 'fs';

import tap from 'tap';

import { grabProject } from '../lib/grab-project.js';
import { removeDirectory } from '../lib/utils.js';

const { test } = tap;

const __dirname = dirname(fileURLToPath(import.meta.url));
const sandbox = join(tmpdir(), `citgm-${Date.now()}-grab-project`);
const fixtures = join(__dirname, 'fixtures');

test('grab-project: setup', async () => {
  await fs.mkdir(sandbox, { recursive: true });
});

test('grab-project: npm module', async (t) => {
  t.plan(1);
  const context = {
    emit: function () {},
    path: sandbox,
    module: {
      raw: 'omg-i-pass'
    },
    meta: {},
    options: {}
  };
  await grabProject(context);
  const stats = await fs.stat(context.unpack);
  t.ok(stats.isFile(), 'The tar ball should exist on the system');
});

test('grab-project: local', async (t) => {
  t.plan(1);
  const context = {
    emit: function () {},
    path: sandbox,
    module: {
      raw: './test/fixtures/omg-i-pass',
      type: 'directory'
    },
    meta: {},
    options: {}
  };
  await grabProject(context);
  const stats = await fs.stat(context.unpack);
  t.ok(stats.isFile(), 'The tar ball should exist on the system');
});

test('grab-project: lookup table', async (t) => {
  t.plan(1);
  const context = {
    emit: function () {},
    path: sandbox,
    module: {
      raw: 'lodash'
    },
    meta: {},
    options: {}
  };
  await grabProject(context);
  const stats = await fs.stat(context.unpack);
  t.ok(stats.isFile(), 'The tar ball should exist on the system');
});

test('grab-project: local', async (t) => {
  t.plan(1);
  const context = {
    emit: function () {},
    path: sandbox,
    module: {
      raw: 'omg-i-pass',
      type: 'directory'
    },
    options: {}
  };
  process.chdir(fixtures);
  await grabProject(context);
  const stats = await fs.stat(context.unpack);
  t.ok(stats.isFile(), 'The tar ball should exist on the system');
  process.chdir(__dirname);
});

test('grab-project: module does not exist', async (t) => {
  t.plan(2);
  const context = {
    emit: function () {},
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
    emit: function () {},
    path: join(sandbox, 'git-clone'),
    module: {
      useGitClone: true,
      name: 'omg-i-pass',
      raw: 'https://github.com/MylesBorins/omg-i-pass.git',
      ref: 'v3.0.0'
    },
    options: {}
  };
  await grabProject(context);
  const stats = await fs.stat(join(context.path, 'omg-i-pass/package.json'));
  t.ok(stats.isFile(), 'The project must be cloned locally');
});

test('grab-project: fail with bad ref', async (t) => {
  t.plan(1);
  const context = {
    emit: function () {},
    path: join(sandbox, 'git-bad-ref'),
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
      /^Command failed\b.+\bgit fetch ['"]--depth=1['"] origin bad-git-ref/
    );
  }
});

test('grab-project: timeout', async (t) => {
  t.plan(1);
  const context = {
    emit: function () {},
    path: sandbox,
    module: {
      name: 'omg-i-pass',
      raw: 'omg-i-pass'
    },
    meta: {},
    options: {
      npmLevel: 'silly',
      timeout: 10
    }
  };
  try {
    await grabProject(context);
  } catch (err) {
    t.equal(err && err.message, 'Download Timed Out');
  }
});

tap.teardown(async () => {
  await removeDirectory(sandbox);
});
