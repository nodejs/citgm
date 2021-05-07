// TODO this test does not test any functionality currently
'use strict';

const { test } = require('tap');

const reporter = require('../../lib/reporter');

test('reporter.markdown():', (t) => {
  t.plan(2);
  t.ok(reporter.markdown, 'it should have a markdown reporter');
  t.equal(typeof reporter.markdown, 'function', 'markdown is a function');
  t.end();
});

test('reporter.logger():', (t) => {
  t.plan(2);
  t.ok(reporter.logger, 'it should have a logger reporter');
  t.equal(typeof reporter.logger, 'function', 'logger is a function');
  t.end();
});

test('reporter.tap():', (t) => {
  t.plan(2);
  t.ok(reporter.logger, 'it should have a tap reporter');
  t.equal(typeof reporter.logger, 'function', 'tap is a function');
  t.end();
});

test('reporter.junit():', (t) => {
  t.plan(2);
  t.ok(reporter.junit, 'it should have a junit reporter');
  t.equal(typeof reporter.junit, 'function', 'junit is a function');
  t.end();
});
