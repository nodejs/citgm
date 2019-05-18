import { tmpdir } from 'os';
import { join, resolve, dirname } from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { existsSync, promises as fs } from 'fs';

import fse from 'fs-extra';
import tap from 'tap';
import rimrafLib from 'rimraf';

import { npmContext } from '../helpers/make-context.js';
import { getPackageManagers } from '../../lib/package-manager/index.js';
import { test as packageManagerTest } from '../../lib/package-manager/test.js';

const { test } = tap;
const rimraf = promisify(rimrafLib);
const __dirname = dirname(fileURLToPath(import.meta.url));

const sandbox = join(tmpdir(), `citgm-${Date.now()}`);
const fixtures = join(__dirname, '..', 'fixtures');

const passFixtures = join(fixtures, 'omg-i-pass');
const passTemp = join(sandbox, 'omg-i-pass');

const failFixtures = join(fixtures, 'omg-i-fail');
const failTemp = join(sandbox, 'omg-i-fail');

const badFixtures = join(fixtures, 'omg-i-do-not-support-testing');
const badTemp = join(sandbox, 'omg-i-do-not-support-testing');

const noTestScriptFixtures = join(fixtures, 'omg-i-have-no-test-script');
const noTestScriptTemp = join(sandbox, 'omg-i-have-no-test-script');

const scriptsFixtures = join(fixtures, 'omg-i-pass-with-scripts');
const scriptsTemp = join(sandbox, 'omg-i-pass-with-scripts');

const writeTmpdirFixtures = join(fixtures, 'omg-i-write-to-tmpdir');
const writeTmpdirTemp = join(sandbox, 'omg-i-write-to-tmpdir');

let packageManagers;

test('npm-test: setup', async () => {
  packageManagers = await getPackageManagers();
  await fs.mkdir(sandbox, { recursive: true });
  await Promise.all([
    fse.copy(passFixtures, passTemp),
    fse.copy(failFixtures, failTemp),
    fse.copy(badFixtures, badTemp),
    fse.copy(noTestScriptFixtures, noTestScriptTemp),
    fse.copy(scriptsFixtures, scriptsTemp),
    fse.copy(writeTmpdirFixtures, writeTmpdirTemp)
  ]);
});

test('npm-test: basic module passing', async () => {
  const context = npmContext('omg-i-pass', packageManagers, sandbox, {
    npmLevel: 'silly'
  });
  await packageManagerTest('npm', context);
});

test('npm-test: basic module failing', async (t) => {
  t.plan(1);
  const context = npmContext('omg-i-fail', packageManagers, sandbox);
  try {
    await packageManagerTest('npm', context);
  } catch (err) {
    t.equal(err && err.message, 'The canary is dead:');
  }
});

test('npm-test: basic module no test script', async (t) => {
  t.plan(1);
  const context = npmContext(
    'omg-i-do-not-support-testing',
    packageManagers,
    sandbox
  );
  try {
    await packageManagerTest('npm', context);
  } catch (err) {
    t.equal(err && err.message, 'Module does not support npm-test!');
  }
});

test('npm-test: no package.json', async (t) => {
  t.plan(1);
  const context = npmContext('omg-i-dont-exist', packageManagers, sandbox);
  try {
    await packageManagerTest('npm', context);
  } catch (err) {
    t.equal(err && err.message, 'Package.json Could not be found');
  }
});

test('npm-test: alternative test-path', async (t) => {
  t.plan(1);
  // Same test as 'basic module passing', except with alt node bin which fails.
  const context = npmContext('omg-i-pass', packageManagers, sandbox, {
    npmLevel: 'silly',
    testPath: resolve(__dirname, '..', 'fixtures', 'fakenodebin')
  });
  try {
    await packageManagerTest('npm', context);
  } catch (err) {
    t.equal(err && err.message, 'The canary is dead:');
  }
});

test('npm-test: timeout', async (t) => {
  t.plan(2);
  const context = npmContext('omg-i-pass', packageManagers, sandbox, {
    npmLevel: 'silly',
    timeout: 100
  });
  try {
    await packageManagerTest('npm', context);
  } catch (err) {
    t.notOk(context.module.flaky, 'Time out should not mark module flaky');
    t.equal(err && err.message, 'Test Timed Out');
  }
});

test('npm-test: module with scripts passing', async () => {
  const context = npmContext(
    {
      name: 'omg-i-pass-with-scripts',
      scripts: ['test-build', 'test']
    },
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly'
    }
  );
  await packageManagerTest('npm', context);
});

test('npm-test: module with no test script failing', async (t) => {
  t.plan(1);
  const context = npmContext(
    {
      name: 'omg-i-have-no-test-script'
    },
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly'
    }
  );
  try {
    await packageManagerTest('npm', context);
  } catch (err) {
    t.equal(err && err.message, 'Module does not support npm-test!');
  }
});

test('npm-test: module with no test script passing', async () => {
  const context = npmContext(
    {
      name: 'omg-i-have-no-test-script',
      scripts: ['test:node']
    },
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly'
    }
  );
  await packageManagerTest('npm', context);
});

test('npm-test: tmpdir is redirected', async (t) => {
  t.plan(1);
  const context = npmContext(
    'omg-i-write-to-tmpdir',
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly'
    }
  );
  context.npmConfigTmp = writeTmpdirTemp;
  await packageManagerTest('npm', context);
  t.ok(
    existsSync(join(writeTmpdirTemp, 'omg-i-write-to-tmpdir-testfile')),
    'Temporary file is written into the redirected temporary directory'
  );
});

test('npm-test: teardown', async () => {
  await rimraf(sandbox);
});
