import { tmpdir } from 'os';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

import fse from 'fs-extra';
import tap from 'tap';
import rimrafLib from 'rimraf';

import { getPackageManagers } from '../../lib/package-manager/index.js';
import packageManagerInstall from '../../lib/package-manager/install.js';
import { npmContext } from '../helpers/make-context.js';

const { test } = tap;
const rimraf = promisify(rimrafLib);

const sandbox = join(tmpdir(), `citgm-${Date.now()}`);
const fixtures = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'fixtures'
);
const moduleFixtures = join(fixtures, 'omg-i-pass');
const moduleTemp = join(sandbox, 'omg-i-pass');
const extraParamFixtures = join(fixtures, 'omg-i-pass-with-install-param');
const extraParamTemp = join(sandbox, 'omg-i-pass-with-install-param');
const badFixtures = join(fixtures, 'omg-bad-tree');
const badTemp = join(sandbox, 'omg-bad-tree');

let packageManagers;

test('yarn-install: setup', async () => {
  packageManagers = await getPackageManagers();
  await fs.mkdir(sandbox, { recursive: true });
  await Promise.all([
    fse.copy(moduleFixtures, moduleTemp),
    fse.copy(extraParamFixtures, extraParamTemp),
    fse.copy(badFixtures, badTemp)
  ]);
});

test('yarn-install: basic module', async () => {
  const context = npmContext('omg-i-pass', packageManagers, sandbox);
  await packageManagerInstall('yarn', context);
});

test('yarn-install: no package.json', async (t) => {
  t.plan(2);
  const context = npmContext('omg-i-fail', packageManagers, sandbox);
  try {
    await packageManagerInstall('yarn', context);
  } catch (err) {
    t.equal(err && err.message, 'Install Failed');
    t.notOk(context.module.flaky, 'Module failed but is not flaky');
  }
});

test('yarn-install: timeout', async (t) => {
  t.plan(2);
  const context = npmContext('omg-i-pass', packageManagers, sandbox, {
    timeout: 10
  });
  try {
    await packageManagerInstall('yarn', context);
  } catch (err) {
    t.notOk(context.module.flaky, 'Time out should not mark module flaky');
    t.equal(err && err.message, 'Install Timed Out');
  }
});

test('yarn-install: failed install', async (t) => {
  t.plan(3);
  const context = npmContext('omg-bad-tree', packageManagers, sandbox);
  const expected = {
    testError: /\/THIS-WILL-FAIL: Not found/
  };
  try {
    await packageManagerInstall('yarn', context);
  } catch (err) {
    t.notOk(context.module.flaky, 'Module failed is not flaky');
    t.equal(err && err.message, 'Install Failed');
    t.match(context, expected, 'Install error reported');
  }
});

test('yarn-install: teardown', async () => {
  await rimraf(sandbox);
});
