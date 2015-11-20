'use strict';

// TODO this does not test HMAC
// TODO this does not test the lookup table
// TODO this does not test custom scripts

var test = require('tap').test;

var citgm = require('../lib/citgm');

test('citgm: omg-i-pass', function (t) {
  const options = {
    script: null,
    hmac: null,
    lookup: null,
    nodedir: null,
    level: null
  };
  const mod = 'omg-i-pass';
  
  citgm.Tester(mod, options)
  .on('start', function (name) {
    t.equals(name, mod, 'it should be omg-i-pass');
  }).on('fail', function (err) {
    t.error(err);
  }).on('end', function () {
    t.notOk(process.exitCode, 'it should not exit');
    t.done();
  }).run();
});
