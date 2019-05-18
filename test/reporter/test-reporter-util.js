import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import tap from 'tap';

import * as util from '../../lib/reporter/util.js';

const fixtures = JSON.parse(
  readFileSync(new URL('../fixtures/reporter-fixtures.json', import.meta.url))
);

const { test } = tap;

const fixturesPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'fixtures'
);
const carriageReturnPath = join(fixturesPath, 'CR-raw.txt');
const carriageReturnExpectedPath = join(fixturesPath, 'CR-sanitized.txt');

const noPassing = [
  fixtures.iFail,
  fixtures.iFail,
  fixtures.iFail,
  fixtures.iSkipped,
  fixtures.iFlakyFail,
  fixtures.iFlakyFail,
  fixtures.iFlakyFail,
  fixtures.iFlakyFail
];

const somePassing = [
  fixtures.iPass,
  fixtures.iSkipped,
  fixtures.iFlakyPass,
  fixtures.iFlakyFail,
  fixtures.iFail
];

const allPassing = [
  fixtures.iPass,
  fixtures.iSkipped,
  fixtures.iFlakyPass,
  fixtures.iPass
];

const flakeCityUsa = [
  fixtures.iFlakyFail,
  fixtures.iFlakyFail,
  fixtures.iFlakyPass,
  fixtures.iFlakyPass,
  fixtures.iFlakyPass
];

test('getPassing:', (t) => {
  t.plan(4);
  t.equal(
    util.getPassing(noPassing).length,
    0,
    'there should be no passing modules in the noPassing list'
  );
  t.equal(
    util.getPassing(somePassing).length,
    2,
    'there should be two passing modules in the somePassing list'
  );
  t.equal(
    util.getPassing(allPassing).length,
    3,
    'there should be three passing modules in the allPassing list'
  );
  t.equal(
    util.getPassing(flakeCityUsa).length,
    3,
    'there should be two passing modules in the flakeCityUsa list'
  );
  t.end();
});

test('getSkipped:', (t) => {
  t.plan(3);
  t.equal(
    util.getSkipped(noPassing).length,
    1,
    'there should be one skipped module in the noPassing list'
  );
  t.equal(
    util.getSkipped(somePassing).length,
    1,
    'there should be one skipped module  in the somePassing list'
  );
  t.equal(
    util.getSkipped(allPassing).length,
    1,
    'there should be one skipped module  in the allPassing list'
  );
  t.end();
});

test('getFlakyFails:', (t) => {
  t.plan(4);
  t.equal(
    util.getFlakyFails(noPassing).length,
    4,
    'there should be two flaky failing modules in the noPassing list'
  );
  t.equal(
    util.getFlakyFails(somePassing).length,
    1,
    'there should be one flaky failing modules in the somePassing list'
  );
  t.equal(
    util.getFlakyFails(allPassing).length,
    0,
    'there should be no flaky failing modules in the allPassing list'
  );
  t.equal(
    util.getFlakyFails(flakeCityUsa).length,
    2,
    'there should be two flaky failing modules in the flakeCityUsa list'
  );
  t.end();
});

test('getFails:', (t) => {
  t.plan(4);
  t.equal(
    util.getFails(noPassing).length,
    3,
    'there should be three failing modules in the noPassing list'
  );
  t.equal(
    util.getFails(somePassing).length,
    1,
    'there should be one failing modules in the somePassing list'
  );
  t.equal(
    util.getFails(allPassing).length,
    0,
    'there should be no failing modules in the allPassing list'
  );
  t.equal(
    util.getFails(flakeCityUsa).length,
    0,
    'there should be no failing modules in the flakeCityUsa list'
  );
  t.end();
});

test('hasFailures:', (t) => {
  t.plan(4);
  t.ok(
    util.hasFailures(noPassing),
    'there should be failures in the noPassing list'
  );
  t.ok(
    util.hasFailures(somePassing),
    'there should be failures in the somePassing list'
  );
  t.notOk(
    util.hasFailures(allPassing),
    'there should be no failures in the allPassing list'
  );
  t.notOk(
    util.hasFailures(flakeCityUsa),
    'there should be no failures in the flakeCityUsa list'
  );
  t.end();
});

test('util.sanitizeOutput', (t) => {
  t.plan(1);
  const raw = readFileSync(carriageReturnPath, 'utf-8');
  const expected = readFileSync(carriageReturnExpectedPath, 'utf-8');
  let result = util.sanitizeOutput(raw, '#');
  result += '\n';
  t.equal(
    result,
    expected,
    'there should be a # on every line & escape char' + 'should be removed'
  );
  t.end();
});
