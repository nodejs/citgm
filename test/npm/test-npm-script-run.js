const test = require('tap').test;
const path = require('path');
const os = require('os');

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const rewire = require('rewire');

const run = rewire('../../lib/npm/script/run');

const fixtures = path.join(__dirname, '..', 'fixtures');

const passingScript = path.join(fixtures, 'example-test-script-passing.sh');
const failingScript = path.join(fixtures, 'example-test-script-failing.sh');
const badPath = path.join(fixtures, 'example-test-script-does-not-exist');

const sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now() + 'run-test');

test('npm.script.run: setup', function (t) {
  mkdirp(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});

test('npm.script.run: should pass with passing script', function (t) {
  var context = {
    path: sandbox,
    emit: function () {},
    module: {
      name: 'run-test',
      stripAnsi: true
    },
    options: {}
  };
  run(context, passingScript, 'the canary is dead', function (err) {
    t.error(err);
    t.end();
  });
});

test('npm.script.run: should fail with failing script', function (t) {
  var context = {
    path: sandbox,
    emit: function () {},
    module: {
      name: 'run-test'
    },
    options: {}
  };
  var failingMsg = 'the canary is dead';
  run(context, failingScript, failingMsg, function (err) {
    t.equals(err && err.message, failingMsg);
    t.end();
  });
});

test('npm.script.run: should fail with failing script (no msg)', function (t) {
  var context = {
    path: sandbox,
    emit: function () {},
    module: {
      name: 'run-test'
    },
    options: {}
  };
  run(context, failingScript, function (err) {
    t.match(err.message, /failed/);
    t.end();
  });
});

test('npm.script.run: should fail with a bad path', function (t) {
  var context = {
    path: sandbox,
    emit: function () {},
    module: {
      name: 'run-test'
    },
    options: {}
  };
  run(context, badPath, 'the canary is dead', function (err) {
    t.match(err.message, /ENOENT/, 'we should receive a ENOENT warning');
    t.end();
  });
});

test('npm.script.run: teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});
