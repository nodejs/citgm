// TODO this test does not test any functionality currently
'use strict';
var fs = require('fs');
var path = require('path');
var os = require('os');

var test = require('tap').test;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var tap = require('../../lib/reporter/tap');
var fixtures = require('../fixtures/reporter-fixtures');

var fixturesPath = path.join(__dirname, '..', 'fixtures');
var sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
var outputFile = path.join(sandbox, 'test.tap');

var passingInput = [
  fixtures.iPass,
  fixtures.iFlakyPass
];

var passingExpectedPath = path.join(fixturesPath, 'test-out-passing.txt');

var passingExpected = fs.readFileSync(passingExpectedPath, 'utf-8');

var failingInput = [
  fixtures.iPass,
  fixtures.iFlakyFail,
  fixtures.iFail
];

var failingExpectedPath = path.join(fixturesPath, 'test-out-failing.txt');

var failingExpected = fs.readFileSync(failingExpectedPath, 'utf-8');

test('reporter.tap(): setup', function (t) {
  mkdirp(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});

test('reporter.tap(): passing', function (t) {
  var output = '';
  function logger(message) {
    output += message;
    output += '\n';
  }

  tap(logger, passingInput);
  t.equals(output, passingExpected, 'we should get expected output when all modules pass');
  t.end();
});

test('reporter.tap(): failing', function (t) {
  var output = '';
  function logger(message) {
    output += message;
    output += '\n';
  }

  tap(logger, failingInput);
  t.equals(output, failingExpected), 'we should get the expected output when a module fails';
  t.end();
});

test('reporter.tap(): write to disk', function (t) {
  tap(outputFile, passingInput);
  var expected = fs.readFileSync(outputFile, 'utf8');
  t.equals(expected, passingExpected), 'the file on disk should match the expected output';
  t.end();
});

test('reporter.tap(): teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});
