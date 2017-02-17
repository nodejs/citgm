// TODO this test does not test any functionality currently
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const test = require('tap').test;
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const parser = require('tap-parser');
const str = require('string-to-stream');

const tap = require('../../lib/reporter/tap');
const fixtures = require('../fixtures/reporter-fixtures');

const fixturesPath = path.join(__dirname, '..', 'fixtures');
const sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
const outputFile = path.join(sandbox, 'test.tap');
const outputFileAppend = path.join(sandbox, 'test-append.tap');
const outputFileAppendBlank = path.join(sandbox, 'test-append-blank.tap');

const appendStartFilePath = path.join(fixturesPath, 'appendTestFileStart.txt');

const passingInput = [
  fixtures.iPass,
  fixtures.iFlakyPass
];

const passingExpectedPath = path.join(fixturesPath, 'test-out-tap-passing.txt');
const passingExpectedPathAppend = path.join(fixturesPath,
    'test-out-tap-passing-append.txt');

const tapParserExpected = require('../fixtures/parsed-tap.json');
const passingExpected = fs.readFileSync(passingExpectedPath, 'utf-8');
const passingExpectedAppend = fs.readFileSync(passingExpectedPathAppend,
  'utf-8');

const failingInput = [
  fixtures.iPass,
  fixtures.iFlakyFail,
  fixtures.iFail
];

const failingExpectedPath = path.join(fixturesPath, 'test-out-tap-failing.txt');
const failingExpected = fs.readFileSync(failingExpectedPath, 'utf-8');

test('reporter.tap(): setup', function (t) {
  mkdirp(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});

test('reporter.tap(): passing', function (t) {
  let output = '';
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
  let output = '';
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
  let output = '';
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
  const expected = fs.readFileSync(outputFile, 'utf8');
  t.equals(expected, passingExpected), 'the file on disk should match the'
  + ' expected output';
  t.end();
});

test('reporter.tap(): append to disk', function (t) {
  const appendStartFile = fs.readFileSync(appendStartFilePath, 'utf-8');
  fs.writeFileSync(outputFileAppend, appendStartFile);
  tap(outputFileAppend, passingInput, true);
  const expected = fs.readFileSync(outputFileAppend, 'utf8');
  t.equals(expected, passingExpectedAppend), 'the file on disk should match the'
  + ' expected output';
  t.end();
});

test('reporter.tap(): append to disk when file does not exist', function (t) {
  tap(outputFileAppendBlank, passingInput, true);
  const expected = fs.readFileSync(outputFileAppendBlank, 'utf8');
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
