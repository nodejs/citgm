// TODO this test does not test any functionality currently
'use strict';
const test = require('tap').test;

const reporter = require('../../lib/reporter');

test('reporter.markdown():', function (t) {
  t.ok(reporter.markdown, 'it should have a markdown reporter');
  t.equals(typeof reporter.markdown, 'function', 'markdown is a function');
  t.end();
});

test('reporter.logger():', function (t) {
  t.ok(reporter.logger, 'it should have a logger reporter');
  t.equals(typeof reporter.logger, 'function', 'logger is a function');
  t.end();
});

test('reporter.tap():', function (t) {
  t.ok(reporter.logger, 'it should have a tap reporter');
  t.equals(typeof reporter.logger, 'function', 'tap is a function');
  t.end();
});

test('reporter.junit():', function (t) {
  t.ok(reporter.junit, 'it should have a junit reporter');
  t.equals(typeof reporter.junit, 'function', 'junit is a function');
  t.end();
});
