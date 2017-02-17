'use strict';
const test = require('tap').test;

const loggerReporter = require('../../lib/reporter/logger');
const fixtures = require('../fixtures/reporter-fixtures');

let output = '';

function metaLogger(title, msg) {
  output += title;
  if (msg) {
    output += msg;
  }
}
const logger = {
  info: metaLogger,
  error: metaLogger,
  warn: metaLogger
};

test('single passing module:', function (t) {
  var expected = 'passing module(s)';
  expected += 'module name:' + 'iPass';
  expected += 'version:' + '4.2.2';
  expected += 'done';
  expected += 'The smoke test has passed.';
  output = '';
  loggerReporter(logger, fixtures.iPass);
  t.equals(output, expected, 'we should have the expected logged output');
  t.end();
});

test('single failing module:', function (t) {
  var expected = 'failing module(s)';
  expected += 'module name:' + 'iFail';
  expected += 'version:' + '3.0.1';
  expected += 'error:' + 'I dun wurk';
  expected += 'error:' + 'Thanks for testing!';
  expected += 'done';
  expected += 'The smoke test has failed.';
  output = '';
  loggerReporter(logger, fixtures.iFail);
  t.equals(output, expected, 'we should have the expected logged output');
  t.end();
});

test('multiple modules passing, with a flaky module that fails:', function (t) {
  var expected = 'passing module(s)';
  expected += 'module name:' + 'iPass';
  expected += 'version:' + '4.2.2';
  expected += 'module name:' + 'iFlakyPass';
  expected += 'version:' + '3.0.1';
  expected += 'flaky module(s)';
  expected += 'module name:' + 'iFlakyFail';
  expected += 'version:' + '3.3.3';
  expected += 'error:' + 'I dun wurk';
  expected += 'error:' + 'Thanks for testing!';
  expected += 'done';
  expected += 'The smoke test has passed.';
  output = '';
  loggerReporter(logger, [fixtures.iPass, fixtures.iFlakyPass,
    fixtures.iFlakyFail]);
  t.equals(output, expected, 'we should have the expected logged output');
  t.end();
});
