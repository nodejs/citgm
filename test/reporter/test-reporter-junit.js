import { readFileSync, writeFileSync, promises as fs } from 'fs';
import { dirname, join } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

import tap from 'tap';
import _ from 'lodash';
import xml2js from 'xml2js';

import junitReporter from '../../lib/reporter/junit.js';
import { removeDirectory } from '../../lib/utils.js';

const { test } = tap;
const parseString = promisify(xml2js.parseString);

const fixtures = JSON.parse(
  readFileSync(new URL('../fixtures/reporter-fixtures.json', import.meta.url))
);

const fixturesPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'fixtures'
);
const sandbox = join(tmpdir(), `citgm-${Date.now()}-test-reporter-junit`);
const outputFile = join(sandbox, 'test.xml');
const outputFileAppend = join(sandbox, 'test-append.xml');

const appendStartFilePath = join(fixturesPath, 'appendTestFileStart.txt');

const passingInput = [fixtures.iPass, fixtures.iFlakyPass];

const passingExpectedPath = join(fixturesPath, 'test-out-xml-passing.txt');
const passingExpectedPathAppend = join(
  fixturesPath,
  'test-out-xml-passing-append.txt'
);

const passingExpected = readFileSync(passingExpectedPath, 'utf-8');
const passingExpectedAppend = readFileSync(passingExpectedPathAppend, 'utf-8');

const failingInput = [
  fixtures.iPass,
  fixtures.iFlakyFail,
  fixtures.iFail,
  fixtures.iSkipped
];

const junitParserExpected = JSON.parse(
  readFileSync(new URL('../fixtures/parsed-junit.json', import.meta.url))
);
const failingExpectedPath = join(fixturesPath, 'test-out-xml-failing.txt');
const failingExpected = readFileSync(failingExpectedPath, 'utf-8');

const badOutputPath = join(fixturesPath, 'badOutput');
const badOutputTooPath = join(fixturesPath, 'badOutput2');
const badOutput = readFileSync(badOutputPath, 'utf-8');
const badOutputToo = readFileSync(badOutputTooPath, 'utf-8');

test('reporter.junit(): setup', async () => {
  await fs.mkdir(sandbox, { recursive: true });
});

test('reporter.junit(): passing', (t) => {
  t.plan(1);
  let output = '';
  function logger(message) {
    output += message;
    output += '\n';
  }

  junitReporter(logger, passingInput);
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
    junitReporter(logger, corruptXml);
  }, 'parsing bad data should not throw');

  t.doesNotThrow(() => {
    junitReporter(logger, corruptXmlToo);
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

  junitReporter(logger, failingInput);
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

  junitReporter(logger, failingInput);
  const result = await parseString(output);
  t.same(
    result,
    junitParserExpected,
    'we should get the expected output when a module fails'
  );
});

test('reporter.junit(): write to disk', (t) => {
  t.plan(1);
  junitReporter(outputFile, passingInput);
  const expected = readFileSync(outputFile, 'utf8');
  t.equal(expected, passingExpected),
    'the file on disk should match the' + ' expected output';
  t.end();
});

test('reporter.junit(): append to disk', (t) => {
  t.plan(1);
  const appendStartFile = readFileSync(appendStartFilePath, 'utf-8');
  writeFileSync(outputFileAppend, appendStartFile);
  junitReporter(outputFileAppend, passingInput, true);
  const expected = readFileSync(outputFileAppend, 'utf-8');
  t.equal(expected, passingExpectedAppend),
    'the file on disk should match the' + ' expected output';
  t.end();
});

tap.teardown(async () => {
  await removeDirectory(sandbox);
});
