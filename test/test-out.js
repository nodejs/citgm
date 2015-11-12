// TODO this test does not test any functionality currently
'use strict';
var test = require('tap').test;

var Logger = require('../lib/out.js');

var log = Logger();

test('out:', function (t) {
  t.ok(log.silly, 'there should be a silly logging level');
  t.ok(log.verbose, 'there should be a verbose logging level');
  t.ok(log.info, 'there should be a info logging level');
  t.ok(log.warn, 'there should be a warn logging level');
  t.ok(log.error, 'there should be a error logging level');
  t.end();
});
