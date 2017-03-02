'use strict';

const test = require('tap').test;

const spawn = require('../../lib/spawn');

const citgmPath = require.resolve('../../bin/citgm-stress.js');

test('bin: omg-i-pass /w repeat x2 /w tap to file /w junit to file /w append',
function (t) {
  t.plan(1);
  const proc = spawn(citgmPath, ['omg-i-pass', '2', '--tap', '/dev/null',
    '--junit', '/dev/null', '--append']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', function (code) {
    t.ok(code === 0, 'omg-i-pass should pass and exit with a code of zero');
  });
});

test('bin: omg-i-fail /w repeat x2 /w tap /w junit /w markdown output'
+ ' /w nodedir /w parallel', function (t) {
  t.plan(1);
  const proc = spawn(citgmPath, ['omg-i-fail', '2', '-m', '-t', '-x', '-d',
    '/dev/null', '-J']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', function (code) {
    t.equal(code, 1, 'omg-i-fail should fail and exit with a code of one');
  });
});

test('bin: omg-i-pass /w repeat no repeat', function (t) {
  t.plan(1);
  const proc = spawn(citgmPath, ['omg-i-pass']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', function (code) {
    t.equal(code, 1, 'omg-i-pass should fail because no repeat was specified');
  });
});

test('bin: omg-i-pass /w repeat x1 /w local module', function (t) {
  t.plan(1);
  const proc = spawn(citgmPath, ['./test/fixtures/omg-i-pass', '1']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', function (code) {
    t.ok(code === 0, 'omg-i-pass should pass and exit with a code of zero');
  });
});

test('bin: sigterm /w repeat x1', function (t) {
  t.plan(1);

  const proc = spawn(citgmPath, ['omg-i-pass', '1', '-v', 'verbose']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.stdout.once('data', function () {
    proc.kill('SIGINT');
  });
  proc.on('exit', function (code) {
    t.equal(code, 1, 'omg-i-pass should fail from a sigint');
  });
});

test('bin: install from sha /w repeat x1', function (t) {
  t.plan(1);
  const proc = spawn(citgmPath, ['omg-i-pass', '1', '-t', '-c',
    '37c34bad563599782c622baf3aaf55776fbc38a8']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', function (code) {
    t.ok(code === 0, 'omg-i-pass should pass and exit with a code of zero');
  });
});
