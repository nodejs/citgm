// TODO this test does not test any functionality currently
'use strict';

const { test } = require('tap');
const rewire = require('rewire');

const Logger = rewire('../lib/out.js');

test('out: no color', (t) => {
  t.plan(5);
  const log = Logger();
  t.ok(log.silly, 'there should be a silly logging level');
  t.ok(log.verbose, 'there should be a verbose logging level');
  t.ok(log.info, 'there should be a info logging level');
  t.ok(log.warn, 'there should be a warn logging level');
  t.ok(log.error, 'there should be a error logging level');
  t.end();
});

test('out: with color', (t) => {
  t.plan(5);
  const supportsColor = Logger.__get__('supportsColor');
  Logger.__set__('supportsColor', () => {
    return { stdout: true, stderr: true };
  });
  const output = Logger.__get__('output');
  Logger.__set__('output', () => {
    return true;
  });
  const log = Logger();
  t.notOk(
    log.silly(),
    'there should be a silly logging level that is a' +
      ' function with no return'
  );
  t.notOk(
    log.verbose(),
    'there should be a verbose logging level that is a function with no' +
      ' return'
  );
  t.notOk(
    log.info(),
    'there should be a info logging level that is a function with no return'
  );
  t.notOk(
    log.warn(),
    'there should be a warn logging level that is a function with no return'
  );
  t.notOk(
    log.error(),
    'there should be a error logging level that is a' +
      ' function with no return'
  );
  Logger.__set__('supportsColor', supportsColor);
  Logger.__set__('output', output);
  t.end();
});
