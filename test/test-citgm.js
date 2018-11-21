'use strict';

const test = require('tap').test;
const rewire = require('rewire');

const citgm = rewire('../lib/citgm');

test('citgm: omg-i-pass', function (t) {
  const options = {
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
    t.end();
  }).run();
});

test('citgm: omg-i-pass from git url', function (t) {
  const options = {
    hmac: null,
    lookup: null,
    nodedir: null,
    level: null
  };

  const mod = 'git+https://github.com/MylesBorins/omg-i-pass';

  citgm.Tester(mod, options)
  .on('start', function (name) {
    t.equals(name, mod, 'it should be omg-i-pass');
  }).on('fail', function (err) {
    t.error(err);
  }).on('end', function () {
    t.notOk(process.exitCode, 'it should not exit');
    t.end();
  }).run();
});
