'use strict';

const test = require('tap').test;
const spawn = require('../../lib/spawn');

const citgmAllPath = require.resolve('../../bin/citgm-all.js');

const isWin32 = process.platform === 'win32';
const nullDevice = isWin32 ? '\\\\.\\NUL' : '/dev/null';

test('citgm-all: /w markdown /w -j', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '-l',
    'test/fixtures/custom-lookup.json',
    '-m',
    '-j',
    '1'
  ]);
  proc.on('error', (err) => {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', (code) => {
    t.equals(code, 0, 'citgm-all should run all the tests in the lookup');
  });
});

test('citgm-all: /w missing lookup.json', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '-l',
    'test/fixtures/this-does-not-exist-json'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(
      code,
      1,
      'citgm-all should fail if the lookup.json does not exist'
    );
  });
});

test('citgm-all: /w bad lookup.json', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '-l',
    'test/fixtures/custom-lookup-broken.json'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(
      code,
      1,
      'citgm-all should fail if the lookup.json contains errors'
    );
  });
});

test('citgm-all: fail /w tap /w junit', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '-l',
    'test/fixtures/custom-lookup-fail.json',
    '-t',
    '-x'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(code, 1, 'citgm-all should have failed');
  });
});

test('citgm-all: flaky-fail', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '-l',
    'test/fixtures/custom-lookup-flaky.json'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(code, 0, 'citgm-all should exit with signal 0');
  });
});

test('citgm-all: fail expectFail', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '-l',
    'test/fixtures/custom-lookup-expectFail.json'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(code, 0, 'citgm-all should exit with signal 0');
  });
});

test('citgm-all: pass expectFail', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '-l',
    'test/fixtures/custom-lookup-expectFail-fail.json'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(code, 1, 'citgm-all should exit with signal 1');
  });
});

test('citgm-all: test with replace', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '-l',
    'test/fixtures/custom-lookup-backwards-compatibilty.json'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(code, 0, 'citgm-all should exit with signal 0');
  });
});

test('citgm-all: flaky-fail ignoring flakyness', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '-f',
    '-l',
    'test/fixtures/custom-lookup-flaky.json'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(code, 1, 'citgm-all should exit with signal 1');
  });
});

test('citgm-all: includeTags', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '--includeTags',
    'tag1',
    '-l',
    'test/fixtures/custom-lookup-tags.json'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(code, 0, 'citgm-all should only run omg-i-pass');
  });
});

test('citgm-all: excludeTags', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '--excludeTags',
    'tag2',
    '-l',
    'test/fixtures/custom-lookup-tags.json'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(code, 0, 'citgm-all should not run omg-i-fail');
  });
});

test('citgm-all: includeTags multiple', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '--includeTags',
    'tag1 noTag1 NoTag2',
    '-l',
    'test/fixtures/custom-lookup-tags.json'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(code, 0, 'citgm-all should only run omg-i-pass');
  });
});

test('citgm-all: excludeTags modulename', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '--excludeTags',
    'omg-i-fail',
    '-l',
    'test/fixtures/custom-lookup-tags.json'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(code, 0, 'citgm-all should not run omg-i-fail');
  });
});

test('citgm-all: includeTags modulename multiple', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '--includeTags',
    'omg-i-pass noTag1 NoTag2',
    '-l',
    'test/fixtures/custom-lookup-tags.json'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(code, 0, 'citgm-all should only run omg-i-pass');
  });
});

test('citgm-all: skip /w rootcheck /w tap to fs /w junit to fs /w append', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '-l',
    'test/fixtures/custom-lookup-skip.json',
    '-s',
    '--tap',
    nullDevice,
    '--junit',
    nullDevice,
    '-a'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(code, 0, 'it should run omg-i-pass and skip omg-i-fail');
  });
});

test('citgm-all: install with yarn', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '-l',
    'test/fixtures/custom-lookup.json',
    '-y'
  ]);
  proc.on('error', (err) => {
    t.error(err);
  });
  proc.on('close', (code) => {
    t.equals(code, 0, 'citgm-all should only run omg-i-pass');
  });
});

test('bin: sigterm', (t) => {
  t.plan(1);

  const proc = spawn(citgmAllPath, [
    '-l',
    'test/fixtures/custom-lookup.json',
    '-m'
  ]);
  proc.on('error', (err) => {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.stdout.once('data', () => {
    proc.kill('SIGINT');
  });
  proc.on('exit', (code, signal) => {
    if (isWin32) {
      t.equal(signal, 'SIGINT', 'citgm-all should fail');
    } else {
      t.equal(code, 1, 'citgm-all should fail');
    }
  });
});

test('bin: test custom test', (t) => {
  t.plan(1);
  const proc = spawn(citgmAllPath, [
    '-l',
    'test/fixtures/custom-lookup-customTest.json',
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
  const proc = spawn(citgmAllPath, [
    '-l',
    'test/fixtures/custom-lookup-customTest.json',
    '--customTest',
    `${process.cwd()}/test/fixtures/no such file.js`
  ]);
  proc.on('close', (code) => {
    t.ok(code !== 0, 'omg-i-fail should fail with a non-zero exit code');
  });
});
