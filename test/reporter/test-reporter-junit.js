'use strict';
var fs = require('fs');
var path = require('path');
var os = require('os');

var test = require('tap').test;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var _ = require('lodash');

var junit = require('../../lib/reporter/junit');
var fixtures = require('../fixtures/reporter-fixtures');

var fixturesPath = path.join(__dirname, '..', 'fixtures');
var sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
var outputFile = path.join(sandbox, 'test.xml');
var outputFileAppend = path.join(sandbox, 'test-append.xml');

var appendStartFilePath = path.join(fixturesPath, 'appendTestFileStart.txt');

var passingInput = [
  fixtures.iPass,
  fixtures.iFlakyPass
];

var passingExpectedPath = path.join(fixturesPath, 'test-out-xml-passing.txt');
var passingExpectedPathAppend = path.join(fixturesPath, 'test-out-xml-passing-append.txt');

var passingExpected = fs.readFileSync(passingExpectedPath, 'utf-8');
var passingExpectedAppend = fs.readFileSync(passingExpectedPathAppend, 'utf-8');

var failingInput = [
  fixtures.iPass,
  fixtures.iFlakyFail,
  fixtures.iFail
];

var failingExpectedPath = path.join(fixturesPath, 'test-out-xml-failing.txt');
var failingExpected = fs.readFileSync(failingExpectedPath, 'utf-8');

var badOutputPath = path.join(fixturesPath, 'badOutput');
var badOutputTooPath = path.join(fixturesPath, 'badOutput2');
var badOutput = fs.readFileSync(badOutputPath, 'utf-8');
var badOutputToo = fs.readFileSync(badOutputTooPath, 'utf-8');

test('reporter.junit(): setup', function (t) {
  mkdirp(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});

test('reporter.junit(): passing', function (t) {
  var output = '';
  function logger(message) {
    output += message;
    output += '\n';
  }

  junit(logger, passingInput);
  t.equals(output, passingExpected, 'we should get expected output when all modules pass');
  t.end();
});

test('reporter.junit(): bad output', function (t) {
  t.plan(3);
  var output = '';
  function logger(message) {
    output += message;
    output += '\n';
  }

  var corruptXml = _.cloneDeep(passingInput);
  corruptXml[0].testOutput = badOutput;
  var corruptXmlToo = _.cloneDeep(passingInput);
  corruptXmlToo[0].testOutput = badOutputToo;

  t.doesNotThrow(function () {
    junit(logger, corruptXml);
  }, 'parsing bad data should not throw');

  t.doesNotThrow(function () {
    junit(logger, corruptXmlToo);
  }, 'parsing bad data should not throw');

  t.ok(output);
});

test('reporter.junit(): failing', function (t) {
  var output = '';
  function logger(message) {
    output += message;
    output += '\n';
  }

  junit(logger, failingInput);
  t.equals(output, failingExpected), 'we should get the expected output when a module fails';
  t.end();
});

test('reporter.junit(): write to disk', function (t) {
  junit(outputFile, passingInput);
  var expected = fs.readFileSync(outputFile, 'utf8');
  t.equals(expected, passingExpected), 'the file on disk should match the expected output';
  t.end();
});

test('reporter.junit(): append to disk', function (t) {
  var appendStartFile = fs.readFileSync(appendStartFilePath, 'utf-8');
  fs.writeFileSync(outputFileAppend, appendStartFile);
  junit(outputFileAppend, passingInput, true);
  var expected = fs.readFileSync(outputFileAppend, 'utf-8');
  t.equals(expected, passingExpectedAppend), 'the file on disk should match the expected output';
  t.end();
});

test('reporter.junit(): teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});
