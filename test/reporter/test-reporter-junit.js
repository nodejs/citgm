'use strict';

const fs = require('fs');
const { mkdir } = fs.promises;
const path = require('path');
const os = require('os');
const { promisify } = require('util');

const { test } = require('tap');
const rimraf = promisify(require('rimraf'));
const _ = require('lodash');
const parseString = promisify(require('xml2js').parseString);

const junit = require('../../lib/reporter/junit');
const fixtures = require('../fixtures/reporter-fixtures');

const fixturesPath = path.join(__dirname, '..', 'fixtures');
const sandbox = path.join(os.tmpdir(), `citgm-${Date.now()}`);
const outputFile = path.join(sandbox, 'test.xml');
const outputFileAppend = path.join(sandbox, 'test-append.xml');

const appendStartFilePath = path.join(fixturesPath, 'appendTestFileStart.txt');

const passingInput = [fixtures.iPass, fixtures.iFlakyPass];

const passingExpectedPath = path.join(fixturesPath, 'test-out-xml-passing.txt');
const passingExpectedPathAppend = path.join(
  fixturesPath,
  'test-out-xml-passing-append.txt'
);

const passingExpected = fs.readFileSync(passingExpectedPath, 'utf-8');
const passingExpectedAppend = fs.readFileSync(
  passingExpectedPathAppend,
  'utf-8'
);

const failingInput = [
  fixtures.iPass,
  fixtures.iFlakyFail,
  fixtures.iFail,
  fixtures.iSkipped
];

const junitParserExpected = require('../fixtures/parsed-junit.json');
const failingExpectedPath = path.join(fixturesPath, 'test-out-xml-failing.txt');
const failingExpected = fs.readFileSync(failingExpectedPath, 'utf-8');

const badOutputPath = path.join(fixturesPath, 'badOutput');
const badOutputTooPath = path.join(fixturesPath, 'badOutput2');
const badOutput = fs.readFileSync(badOutputPath, 'utf-8');
const badOutputToo = fs.readFileSync(badOutputTooPath, 'utf-8');

test('reporter.junit(): setup', async () => {
  await mkdir(sandbox, { recursive: true });
});

test('reporter.junit(): passing', (t) => {
  t.plan(1);
  let output = '';
  function logger(message) {
    output += message;
    output += '\n';
  }

  junit(logger, passingInput);
  t.equal(
    output,
    passingExpected,
    'we should get expected output when all' + ' modules pass'
  );
  t.end();
});

test('reporter.junit(): bad output', (t) => {
  t.plan(3);
  let output = '';
  function logger(message) {
    output += message;
    output += '\n';
  }

  const corruptXml = _.cloneDeep(passingInput);
  corruptXml[0].testOutput = badOutput;
  const corruptXmlToo = _.cloneDeep(passingInput);
  corruptXmlToo[0].testOutput = badOutputToo;

  t.doesNotThrow(() => {
    junit(logger, corruptXml);
  }, 'parsing bad data should not throw');

  t.doesNotThrow(() => {
    junit(logger, corruptXmlToo);
  }, 'parsing bad data should not throw');

  t.ok(output);
});

test('reporter.junit(): failing', (t) => {
  t.plan(1);
  let output = '';
  function logger(message) {
    output += message;
    output += '\n';
  }

  junit(logger, failingInput);
  t.equal(output, failingExpected),
    'we should get the expected output when a' + ' module fails';
  t.end();
});

test('reporter.junit(): parser', async (t) => {
  t.plan(1);
  let output = '';
  function logger(message) {
    output += message;
    output += '\n';
  }

  junit(logger, failingInput);
  const result = await parseString(output);
  t.same(
    result,
    junitParserExpected,
    'we should get the expected output when a module fails'
  );
});

test('reporter.junit(): write to disk', (t) => {
  t.plan(1);
  junit(outputFile, passingInput);
  const expected = fs.readFileSync(outputFile, 'utf8');
  t.equal(expected, passingExpected),
    'the file on disk should match the' + ' expected output';
  t.end();
});

test('reporter.junit(): append to disk', (t) => {
  t.plan(1);
  const appendStartFile = fs.readFileSync(appendStartFilePath, 'utf-8');
  fs.writeFileSync(outputFileAppend, appendStartFile);
  junit(outputFileAppend, passingInput, true);
  const expected = fs.readFileSync(outputFileAppend, 'utf-8');
  t.equal(expected, passingExpectedAppend),
    'the file on disk should match the' + ' expected output';
  t.end();
});

test('reporter.junit(): teardown', async () => {
  await rimraf(sandbox);
});
