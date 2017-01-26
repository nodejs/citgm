// TODO this test does not test any functionality currently
'use strict';
var fs = require('fs');
var path = require('path');
var os = require('os');

var test = require('tap').test;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var parser = require('tap-parser');
var str = require('string-to-stream');

var tap = require('../../lib/reporter/tap');
var fixtures = require('../fixtures/reporter-fixtures');

var fixturesPath = path.join(__dirname, '..', 'fixtures');
var sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
var outputFile = path.join(sandbox, 'test.tap');
var outputFileAppend = path.join(sandbox, 'test-append.tap');
var outputFileAppendBlank = path.join(sandbox, 'test-append-blank.tap');

var appendStartFilePath = path.join(fixturesPath, 'appendTestFileStart.txt');

var passingInput = [
  fixtures.iPass,
  fixtures.iFlakyPass
];

var passingExpectedPath = path.join(fixturesPath, 'test-out-tap-passing.txt');
var passingExpectedPathAppend = path.join(fixturesPath,
    'test-out-tap-passing-append.txt');

var tapParserExpected = require('../fixtures/parsed-tap.json');
var passingExpected = fs.readFileSync(passingExpectedPath, 'utf-8');
var passingExpectedAppend = fs.readFileSync(passingExpectedPathAppend, 'utf-8');

var failingInput = [
  fixtures.iPass,
  fixtures.iFlakyFail,
  fixtures.iFail
];

var failingExpectedPath = path.join(fixturesPath, 'test-out-tap-failing.txt');
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
  t.equals(output, passingExpected, 'we should get expected output when all'
  + ' modules pass');
  t.end();
});

test('reporter.tap(): failing', function (t) {
  var output = '';
  function logger(message) {
    output += message;
    output += '\n';
  }

  tap(logger, failingInput);
  t.equals(output, failingExpected), 'we should get the expected output when a'
  + ' module fails';
  t.end();
});

test('reporter.tap(): parser', function (t) {
  var output = '';
  function logger(message) {
    output += message;
  }

  tap(logger, failingInput);
  var p = parser(function (results) {
    t.deepEquals(results, tapParserExpected), 'the tap parser should correctly'
    + ' parse the tap file';
    t.end();
  });
  str(output).pipe(p);
});

test('reporter.tap(): write to disk', function (t) {
  tap(outputFile, passingInput);
  var expected = fs.readFileSync(outputFile, 'utf8');
  t.equals(expected, passingExpected), 'the file on disk should match the'
  + ' expected output';
  t.end();
});

test('reporter.tap(): append to disk', function (t) {
  var appendStartFile = fs.readFileSync(appendStartFilePath, 'utf-8');
  fs.writeFileSync(outputFileAppend, appendStartFile);
  tap(outputFileAppend, passingInput, true);
  var expected = fs.readFileSync(outputFileAppend, 'utf8');
  t.equals(expected, passingExpectedAppend), 'the file on disk should match the'
  + ' expected output';
  t.end();
});

test('reporter.tap(): append to disk when file does not exist', function (t) {
  tap(outputFileAppendBlank, passingInput, true);
  var expected = fs.readFileSync(outputFileAppendBlank, 'utf8');
  t.equals(expected, passingExpected), 'the file on disk should match the'
  + ' expected output';
  t.end();
});

test('reporter.tap(): teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});
