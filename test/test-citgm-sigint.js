'use strict';

var test = require('tap').test;

var citgm = require('../lib/citgm');

test('citgm: omg-i-pass', function (t) {
  var options = {
    script: null,
    hmac: null,
    lookup: null,
    nodedir: null,
    level: null
  };

  var mod = 'omg-i-pass';

  citgm.Tester(mod, options)
  .on('start', function (name) {
    t.equals(name, mod, 'it should be omg-i-pass');
    process.emit('SIGINT');
  }).on('fail', function (err) {
    t.equals(err && err.message, 'Process Interrupted', 'it should fail with a process Interrupted message');
  }).on('end', function () {
    t.notOk(process.exitCode, 'it should exit with a code of 0');
    t.done();
  }).run();
});
