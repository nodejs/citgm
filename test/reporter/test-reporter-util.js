'use strict';
const fs = require('fs');
const path = require('path');

const test = require('tap').test;

const util = require('../../lib/reporter/util');
const fixtures = require('../fixtures/reporter-fixtures');

const fixturesPath = path.join(__dirname, '..', 'fixtures');
const carriageReturnPath = path.join(fixturesPath, 'CR-raw.txt');
const carriageReturnExpectedPath = path.join(fixturesPath, 'CR-sanitized.txt');

const noPassing = [
  fixtures.iFail,
  fixtures.iFail,
  fixtures.iFail,
  fixtures.iFlakyFail,
  fixtures.iFlakyFail,
  fixtures.iFlakyFail,
  fixtures.iFlakyFail
];

const somePassing = [
  fixtures.iPass,
  fixtures.iFlakyPass,
  fixtures.iFlakyFail,
  fixtures.iFail
];

const allPassing = [
  fixtures.iPass,
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

test('getPassing:', function (t) {
  t.equals(util.getPassing(noPassing).length, 0,
      'there should be no passing modules in the noPassing list');
  t.equals(util.getPassing(somePassing).length, 2,
      'there should be two passing modules in the somePassing list');
  t.equals(util.getPassing(allPassing).length, 3,
      'there should be three passing modules in the allPassing list');
  t.equals(util.getPassing(flakeCityUsa).length, 3,
      'there should be two passing modules in the flakeCityUsa list');
  t.end();
});

test('getFlakyFails:', function (t) {
  t.equals(util.getFlakyFails(noPassing).length, 4,
      'there should be two flaky failing modules in the noPassing list');
  t.equals(util.getFlakyFails(somePassing).length, 1,
      'there should be one flaky failing modules in the somePassing list');
  t.equals(util.getFlakyFails(allPassing).length, 0,
      'there should be no flaky failing modules in the allPassing list');
  t.equals(util.getFlakyFails(flakeCityUsa).length, 2,
      'there should be two flaky failing modules in the flakeCityUsa list');
  t.end();
});

test('getFails:', function (t) {
  t.equals(util.getFails(noPassing).length, 3,
      'there should be three failing modules in the noPassing list');
  t.equals(util.getFails(somePassing).length, 1,
      'there should be one failing modules in the somePassing list');
  t.equals(util.getFails(allPassing).length, 0,
      'there should be no failing modules in the allPassing list');
  t.equals(util.getFails(flakeCityUsa).length, 0,
      'there should be no failing modules in the flakeCityUsa list');
  t.end();
});

test('hasFailures:', function (t) {
  t.ok(util.hasFailures(noPassing),
      'there should be failures in the noPassing list');
  t.ok(util.hasFailures(somePassing),
      'there should be failures in the somePassing list');
  t.notok(util.hasFailures(allPassing),
      'there should be no failures in the allPassing list');
  t.notok(util.hasFailures(flakeCityUsa),
      'there should be no failures in the flakeCityUsa list');
  t.end();
});

test('util.sanitizeOutput', function (t) {
  // Var result = util.sanitizeOutput();
  const raw = fs.readFileSync(carriageReturnPath, 'utf-8');
  const expected = fs.readFileSync(carriageReturnExpectedPath, 'utf-8');
  const result = util.sanitizeOutput(raw, '#');
  t.equals(result, expected, 'there should be a # on every line');
  t.end();
});
