var test = require('tap').test;
var path = require('path');
var os = require('os');

var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var rewire = require('rewire');

var run = rewire('../lib/npm/script/run');

var passingScript = path.join(__dirname, 'fixtures', 'example-test-script-passing.sh');
var failingScript = path.join(__dirname, 'fixtures', 'example-test-script-failing.sh');
var badPath = path.join(__dirname, 'fixtures', 'example-test-script-does-not-exist');

var sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now(), 'run-test');

test('npm.script.run: setup', function (t) {
  mkdirp(sandbox, function (err) {
    t.error(err);
    t.done();
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
    t.done();
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
    t.done();
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
    t.done();
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
    t.done();
  });
});

test('npm.script.run: teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.done();
  });
});
