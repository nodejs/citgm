// TODO this test does not test any functionality currently
'use strict';
var test = require('tap').test;
var rewire = require('rewire');
var Logger = rewire('../lib/out.js');

test('out: no color', function (t) {
  var log = Logger();
  t.ok(log.silly, 'there should be a silly logging level');
  t.ok(log.verbose, 'there should be a verbose logging level');
  t.ok(log.info, 'there should be a info logging level');
  t.ok(log.warn, 'there should be a warn logging level');
  t.ok(log.error, 'there should be a error logging level');
  t.end();
});

test('out: with color', function (t) {
  var supportscolor = Logger.__get__('supportscolor');
  Logger.__set__('supportscolor', function () {
    return true;
  });
  var output = Logger.__get__('output');
  Logger.__set__('output', function () {
    return true;
  });
  var log = Logger();
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
