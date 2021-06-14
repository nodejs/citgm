import { fileURLToPath } from 'url';

import tap from 'tap';

import { spawn } from '../../lib/spawn.js';

const citgmPath = fileURLToPath(new URL('../../bin/citgm.js', import.meta.url));

const { test } = tap;

const isWin32 = process.platform === 'win32';
const nullDevice = isWin32 ? '\\\\.\\NUL' : '/dev/null';

test('bin: omg-i-pass /w tap to file /w junit to file /w append', (t) => {
  t.plan(1);
  const proc = spawn(citgmPath, [
    'omg-i-pass',
    '--tap',
    nullDevice,
    '--junit',
    nullDevice,
    '--append'
  ]);
  proc.on('error', (err) => {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', (code) => {
    t.ok(code === 0, 'omg-i-pass should pass and exit with a code of zero');
  });
});

test('bin: omg-i-fail /w tap /w junit /w markdown output /w nodedir', (t) => {
  t.plan(1);
  const proc = spawn(citgmPath, [
    'omg-i-fail',
    '-m',
    '-t',
    '-x',
    '-d',
    nullDevice
  ]);
  proc.on('error', (err) => {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', (code) => {
    t.equal(code, 1, 'omg-i-fail should fail and exit with a code of one');
  });
});

test('bin: omg-i-pass /w local module', (t) => {
  t.plan(1);
  const proc = spawn(citgmPath, ['./test/fixtures/omg-i-pass']);
  proc.on('error', (err) => {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', (code) => {
    t.ok(code === 0, 'omg-i-pass should pass and exit with a code of zero');
  });
});

test('bin: no module /w root check', (t) => {
  t.plan(1);
  const proc = spawn(citgmPath, ['-s']);
  proc.on('error', (err) => {
    t.error(err);
    t.fail('we should not get an error');
  });
  proc.on('close', (code) => {
    t.equal(code, 0, 'we should exit with a code of 0');
  });
});

test('bin: sigterm', (t) => {
  t.plan(1);

  const proc = spawn(citgmPath, ['omg-i-pass', '-v', 'verbose']);
  proc.on('error', (err) => {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.stdout.once('data', () => {
    proc.kill('SIGINT');
  });
  proc.on('exit', (code, signal) => {
    if (isWin32) {
      t.equal(signal, 'SIGINT', 'omg-i-pass should fail from a sigint');
    } else {
      t.equal(code, 1, 'omg-i-pass should fail from a sigint');
    }
  });
});

test('bin: install from sha', (t) => {
  t.plan(1);
  const proc = spawn(citgmPath, [
    'omg-i-pass',
    '-t',
    '-c',
    '37c34bad563599782c622baf3aaf55776fbc38a8'
  ]);
  proc.on('error', (err) => {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', (code) => {
    t.ok(code === 0, 'omg-i-pass should pass and exit with a code of zero');
  });
});

test('bin: test custom test', (t) => {
  t.plan(1);
  const proc = spawn(citgmPath, [
    'omg-i-fail',
    '--customTest',
    `${process.cwd()}/test/fixtures/custom test script.js`
  ]);
  proc.on('error', (err) => {
    t.error(err);
    t.fail('we should not get an error testing omg-i-fail');
  });
  proc.on('close', (code) => {
    t.ok(code === 0, 'omg-i-fail should pass and exit with a code of zero');
  });
});

test('bin: test custom test', (t) => {
  t.plan(1);
  const proc = spawn(citgmPath, [
    'omg-i-fail',
    '--customTest',
    `${process.cwd()}/test/fixtures/no such file.js`
  ]);
  proc.on('close', (code) => {
    t.ok(code !== 0, 'omg-i-fail should fail with a non-zero exit code');
  });
});
