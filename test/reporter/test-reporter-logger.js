import { readFileSync } from 'fs';

import tap from 'tap';
import ansiRegexLib from 'ansi-regex';

import loggerReporter from '../../lib/reporter/logger.js';

const { test } = tap;
const ansiRegex = ansiRegexLib();

const fixtures = JSON.parse(
  readFileSync(new URL('../fixtures/reporter-fixtures.json', import.meta.url))
);

let output = '';

function metaLogger(title, msg) {
  output += title.replace(ansiRegex, '');
  if (msg) {
    output += msg.replace(ansiRegex, '');
  }
}
const logger = {
  info: metaLogger,
  error: metaLogger,
  warn: metaLogger
};

test('single passing module:', (t) => {
  t.plan(1);
  let expected = 'passing module(s)';
  expected += 'module name:' + 'iPass';
  expected += 'version:' + '4.2.2';
  expected += 'done';
  expected += 'The smoke test has passed.';
  output = '';
  loggerReporter(logger, fixtures.iPass);
  t.equal(output, expected, 'we should have the expected logged output');
  t.end();
});

test('single failing module:', (t) => {
  t.plan(1);
  let expected = 'failing module(s)';
  expected += 'module name:' + 'iFail';
  expected += 'version:' + '3.0.1';
  expected += 'error:' + 'I dun wurk';
  expected += 'error:' + 'Thanks for testing!';
  expected += 'done';
  expected += 'The smoke test has failed.';
  output = '';
  loggerReporter(logger, fixtures.iFail);
  t.equal(output, expected, 'we should have the expected logged output');
  t.end();
});

test('multiple modules passing, with a flaky module that fails:', (t) => {
  t.plan(1);
  let expected = 'passing module(s)';
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
  loggerReporter(logger, [
    fixtures.iPass,
    fixtures.iFlakyPass,
    fixtures.iFlakyFail
  ]);
  t.equal(output, expected, 'we should have the expected logged output');
  t.end();
});
