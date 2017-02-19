'use strict';

const test = require('tap').test;
const spawn = require('../../lib/spawn');

const citgmAllPath = require.resolve('../../bin/citgm-all.js');

test('citgm-all: /w markdown /w -j', function (t) {
  t.plan(1);
  const proc = spawn(citgmAllPath, ['-l', 'test/fixtures/custom-lookup.json',
    '-m', '-j', '1']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', function (code) {
    t.equals(code, 0, 'citgm-all should run all the tests in the lookup');
  });
});

test('citgm-all: envVar /w -J', function (t) {
  t.plan(1);
  const proc = spawn(citgmAllPath, ['-l',
    'test/fixtures/custom-lookup-envVar.json', '-J']);
  proc.on('error', function(err) {
    t.error(err);
  });
  proc.on('close', function (code) {
    t.equals(code, 0, 'citgm-all should export an environment variable');
  });
});

test('citgm-all: /w missing lookup.json', function (t) {
  t.plan(1);
  const proc = spawn(citgmAllPath, ['-l',
    'test/fixtures/this-does-not-exist-json']);
  proc.on('error', function(err) {
    t.error(err);
  });
  proc.on('close', function (code) {
    t.equals(code, 1,
          'citgm-all should fail if the lookup.json does not exist');
  });
});

test('citgm-all: /w bad lookup.json', function (t) {
  t.plan(1);
  const proc = spawn(citgmAllPath, ['-l',
    'test/fixtures/custom-lookup-broken.json']);
  proc.on('error', function(err) {
    t.error(err);
  });
  proc.on('close', function (code) {
    t.equals(code, 1,
        'citgm-all should fail if the lookup.json contains errors');
  });
});

test('citgm-all: fail /w tap /w junit', function (t) {
  t.plan(1);
  const proc = spawn(citgmAllPath, ['-l',
    'test/fixtures/custom-lookup-fail.json', '-t', '-x']);
  proc.on('error', function(err) {
    t.error(err);
  });
  proc.on('close', function (code) {
    t.equals(code, 1, 'citgm-all should have failed');
  });
});

test('citgm-all: flaky-fail', function (t) {
  t.plan(1);
  const proc = spawn(citgmAllPath, ['-l',
    'test/fixtures/custom-lookup-flaky.json']);
  proc.on('error', function(err) {
    t.error(err);
  });
  proc.on('close', function (code) {
    t.equals(code, 0, 'citgm-all should exit with signal 0');
  });
});

test('citgm-all: fail expectFail', function (t) {
  t.plan(1);
  const proc = spawn(citgmAllPath, ['-l',
    'test/fixtures/custom-lookup-expectFail.json']);
  proc.on('error', function(err) {
    t.error(err);
  });
  proc.on('close', function (code) {
    t.equals(code, 0, 'citgm-all should exit with signal 0');
  });
});

test('citgm-all: pass expectFail', function (t) {
  t.plan(1);
  const proc = spawn(citgmAllPath, ['-l',
    'test/fixtures/custom-lookup-expectFail-fail.json']);
  proc.on('error', function(err) {
    t.error(err);
  });
  proc.on('close', function (code) {
    t.equals(code, 1, 'citgm-all should exit with signal 1');
  });
});

test('citgm-all: test with replace', function (t) {
  t.plan(1);
  const proc = spawn(citgmAllPath, ['-l',
    'test/fixtures/custom-lookup-backwards-compatibilty.json']);
  proc.on('error', function(err) {
    t.error(err);
  });
  proc.on('close', function (code) {
    t.equals(code, 0, 'citgm-all should exit with signal 0');
  });
});

test('citgm-all: flaky-fail ignoring flakyness', function (t) {
  t.plan(1);
  const proc = spawn(citgmAllPath, ['-f', '-l',
    'test/fixtures/custom-lookup-flaky.json']);
  proc.on('error', function(err) {
    t.error(err);
  });
  proc.on('close', function (code) {
    t.equals(code, 1, 'citgm-all should exit with signal 1');
  });
});

test('citgm-all: skip /w rootcheck /w tap to fs /w junit to fs /w append',
function (t) {
  t.plan(1);
  const proc = spawn(citgmAllPath, ['-l',
    'test/fixtures/custom-lookup-skip.json', '-s', '--tap', '/dev/null',
    '--junit', '/dev/null', '-a']);
  proc.on('error', function(err) {
    t.error(err);
  });
  proc.on('close', function (code) {
    t.equals(code, 0, 'it should run omg-i-pass and skip omg-i-fail');
  });
});

test('bin: sigterm', function (t) {
  t.plan(1);

  const proc = spawn(citgmAllPath, ['-l', 'test/fixtures/custom-lookup.json',
    '-m']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.stdout.once('data', function () {
    proc.kill('SIGINT');
  });
  proc.on('exit', function (code) {
    t.equal(code, 1, 'citgm-all should fail');
  });
});
