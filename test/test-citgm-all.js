'use strict';

var path = require('path');

var test = require('tap').test;

var spawn = require('../lib/spawn');

var citgmAllPath = path.resolve(__dirname, '..', 'bin', 'citgm-all');

test('citgm-all:', function (t) {
  t.plan(1);
  var proc = spawn(citgmAllPath, ['-l', 'test/fixtures/custom-lookup.json']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', function (code) {
    t.equals(code, 0, 'citgm-all should run all the tests in the lookup');
  });
});

test('citgm-all: fail', function (t) {
  t.plan(1);
  var proc = spawn(citgmAllPath, ['-l', 'test/fixtures/custom-lookup-fail.json']);
  proc.on('error', function(err) {
    t.error(err);
  });
  proc.on('close', function (code) {
    t.equals(code, 1, 'citgm-all should have failed');
  });
});

test('citgm-all: skip', function (t) {
  t.plan(1);
  var proc = spawn(citgmAllPath, ['-l', 'test/fixtures/custom-lookup-skip.json']);
  proc.on('error', function(err) {
    t.error(err);
  });
  proc.on('close', function (code) {
    t.equals(code, 0, 'it should run omg-i-pass and skip omg-i-fail');
  });
});
