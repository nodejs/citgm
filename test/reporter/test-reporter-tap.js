// TODO this test does not test any functionality currently

import { readFileSync, writeFileSync, promises as fs } from 'fs';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';

import tap from 'tap';
import { Parser } from 'tap-parser';
import str from 'string-to-stream';

import tapReporter from '../../lib/reporter/tap.js';
import { removeDirectory } from '../../lib/utils.js';

const fixtures = JSON.parse(
  readFileSync(new URL('../fixtures/reporter-fixtures.json', import.meta.url))
);

const { test } = tap;

const fixturesPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'fixtures'
);
const sandbox = join(tmpdir(), `citgm-${Date.now()}-test-reporter-tap`);
const outputFile = join(sandbox, 'test.tap');
const outputFileAppend = join(sandbox, 'test-append.tap');
const outputFileAppendBlank = join(sandbox, 'test-append-blank.tap');

const appendStartFilePath = join(fixturesPath, 'appendTestFileStart.txt');

const passingInput = [fixtures.iPass, fixtures.iFlakyPass];

const passingExpectedPath = join(fixturesPath, 'test-out-tap-passing.txt');
const passingExpectedPathAppend = join(
  fixturesPath,
  'test-out-tap-passing-append.txt'
);

const tapParserExpected = JSON.parse(
  readFileSync(new URL('../fixtures/parsed-tap.json', import.meta.url))
);
const passingExpected = readFileSync(passingExpectedPath, 'utf-8');
const passingExpectedAppend = readFileSync(passingExpectedPathAppend, 'utf-8');

const failingInput = [fixtures.iPass, fixtures.iFlakyFail, fixtures.iFail];

const failingExpectedPath = join(fixturesPath, 'test-out-tap-failing.txt');
const failingExpected = readFileSync(failingExpectedPath, 'utf-8');

test('reporter.tap(): setup', async () => {
  await fs.mkdir(sandbox, { recursive: true });
});

test('reporter.tap(): passing', (t) => {
  t.plan(1);
  let output = '';
  function logger(message) {
    output += message;
    output += '\n';
  }

  tapReporter(logger, passingInput);
  t.equal(
    output,
    passingExpected,
    'we should get expected output when all' + ' modules pass'
  );
  t.end();
});

test('reporter.tap(): failing', (t) => {
  t.plan(1);
  let output = '';
  function logger(message) {
    output += message;
    output += '\n';
  }

  tapReporter(logger, failingInput);
  t.equal(output, failingExpected),
    'we should get the expected output when a' + ' module fails';
  t.end();
});

test('reporter.tap(): parser', (t) => {
  t.plan(1);
  let output = '';
  function logger(message) {
    output += message;
  }

  tapReporter(logger, failingInput);
  const p = new Parser((results) => {
    // `results` contains JS classes that are not considered same as the
    // plain objects loaded from the JSON file.
    const plainResults = JSON.parse(JSON.stringify(results));
    t.same(plainResults, tapParserExpected),
      'the tap parser should correctly' + ' parse the tap file';
    t.end();
  });
  str(output).pipe(p);
});

test('reporter.tap(): write to disk', (t) => {
  t.plan(1);
  tapReporter(outputFile, passingInput);
  const expected = readFileSync(outputFile, 'utf8');
  t.equal(expected, passingExpected),
    'the file on disk should match the' + ' expected output';
  t.end();
});

test('reporter.tap(): append to disk', (t) => {
  t.plan(1);
  const appendStartFile = readFileSync(appendStartFilePath, 'utf-8');
  writeFileSync(outputFileAppend, appendStartFile);
  tapReporter(outputFileAppend, passingInput, true);
  const expected = readFileSync(outputFileAppend, 'utf8');
  t.equal(expected, passingExpectedAppend),
    'the file on disk should match the' + ' expected output';
  t.end();
});

test('reporter.tap(): append to disk when file does not exist', (t) => {
  t.plan(1);
  tapReporter(outputFileAppendBlank, passingInput, true);
  const expected = readFileSync(outputFileAppendBlank, 'utf8');
  t.equal(expected, passingExpected),
    'the file on disk should match the' + ' expected output';
  t.end();
});

tap.teardown(async () => {
  await removeDirectory(sandbox);
});
