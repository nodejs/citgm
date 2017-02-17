// TODO this test does not test any functionality currently
'use strict';
const test = require('tap').test;
const rewire = require('rewire');
const Logger = rewire('../lib/out.js');

test('out: no color', function (t) {
  const log = Logger();
  t.ok(log.silly, 'there should be a silly logging level');
  t.ok(log.verbose, 'there should be a verbose logging level');
  t.ok(log.info, 'there should be a info logging level');
  t.ok(log.warn, 'there should be a warn logging level');
  t.ok(log.error, 'there should be a error logging level');
  t.end();
});

test('out: with color', function (t) {
  const supportscolor = Logger.__get__('supportscolor');
  Logger.__set__('supportscolor', function () {
    return true;
  });
  const output = Logger.__get__('output');
  Logger.__set__('output', function () {
    return true;
  });
  const log = Logger();
  t.notok(log.silly(), 'there should be a silly logging level that is a'
  + ' function with no return');
  t.notok(log.verbose(),
      'there should be a verbose logging level that is a function with no'
      + ' return');
  t.notok(log.info(),
      'there should be a info logging level that is a function with no return');
  t.notok(log.warn(),
      'there should be a warn logging level that is a function with no return');
  t.notok(log.error(), 'there should be a error logging level that is a'
  + ' function with no return');
  Logger.__set__('supportscolor', supportscolor);
  Logger.__set__('output', output);
  t.end();
});
