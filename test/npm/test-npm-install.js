import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

import tap from 'tap';

import { getPackageManagers } from '../../lib/package-manager/index.js';
import packageManagerInstall from '../../lib/package-manager/install.js';
import { removeDirectory } from '../../lib/utils.js';
import { npmContext } from '../helpers/make-context.js';

const { test } = tap;
const __dirname = dirname(fileURLToPath(import.meta.url));

const sandbox = join(tmpdir(), `citgm-${Date.now()}-npm-install`);
const fixtures = join(__dirname, '..', 'fixtures');
const moduleFixtures = join(fixtures, 'omg-i-pass');
const moduleTemp = join(sandbox, 'omg-i-pass');
const extraParamFixtures = join(fixtures, 'omg-i-pass-with-install-param');
const extraParamTemp = join(sandbox, 'omg-i-pass-with-install-param');
const badFixtures = join(fixtures, 'omg-bad-tree');
const badTemp = join(sandbox, 'omg-bad-tree');

let packageManagers;

test('npm-install: setup', async () => {
  packageManagers = await getPackageManagers();
  await fs.mkdir(sandbox, { recursive: true });
  await Promise.all([
    fs.cp(moduleFixtures, moduleTemp, { recursive: true }),
    fs.cp(extraParamFixtures, extraParamTemp, { recursive: true }),
    fs.cp(badFixtures, badTemp, { recursive: true })
  ]);
});

test('npm-install: basic module', async () => {
  const context = npmContext('omg-i-pass', packageManagers, sandbox, {
    npmLevel: 'silly'
  });
  await packageManagerInstall('npm', context);
});

test('npm-install: custom install command', async (t) => {
  t.plan(1);
  const context = npmContext(
    {
      name: 'omg-i-pass-with-install-param',
      install: ['install', '--extra-param']
    },
    packageManagers,
    sandbox,
    {
      npmLevel: 'silly'
    }
  );
  await packageManagerInstall('npm', context);
  t.notOk(context.module.flaky, 'Module passed and is not flaky');
});

test('npm-install: no package.json', async (t) => {
  t.plan(2);
  const context = npmContext('omg-i-fail', packageManagers, sandbox, {
    npmLevel: 'silly'
  });
  try {
    await packageManagerInstall('npm', context);
  } catch (err) {
    t.equal(err && err.message, 'Install Failed');
    t.notOk(context.module.flaky, 'Module failed but is not flaky');
  }
});

test('npm-install: timeout', async (t) => {
  t.plan(2);
  const context = npmContext('omg-i-pass', packageManagers, sandbox, {
    npmLevel: 'silly',
    timeout: 100
  });
  try {
    await packageManagerInstall('npm', context);
  } catch (err) {
    t.notOk(context.module.flaky, 'Time out should not mark module flaky');
    t.equal(err && err.message, 'Install Timed Out');
  }
});

test('npm-install: failed install', async (t) => {
  t.plan(3);
  const context = npmContext('omg-bad-tree', packageManagers, sandbox, {
    npmLevel: 'http'
  });
  const expected = {
    testOutput: /^$/,
    testError:
      /npm (?:ERR!|error) 404 Not [Ff]ound\s*(:)? .*THIS-WILL-FAIL(@0\.0\.1)?/
  };
  try {
    await packageManagerInstall('npm', context);
  } catch (err) {
    t.notOk(context.module.flaky, 'Module failed is not flaky');
    t.equal(err && err.message, 'Install Failed');
    t.match(context, expected, 'Install error reported');
  }
});

tap.teardown(async () => {
  await removeDirectory(sandbox);
});
