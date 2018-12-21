'use strict';

const test = require('tap').test;
const rewire = require('rewire');

const citgm = rewire('../lib/citgm');

test('citgm: omg-i-pass', (t) => {
  const options = {
    hmac: null,
    lookup: null,
    nodedir: null,
    level: null
  };

  const mod = 'omg-i-pass';

  citgm
    .Tester(mod, options)
    .on('start', (name) => {
      t.equals(name, mod, 'it should be omg-i-pass');
    })
    .on('fail', (err) => {
      t.error(err);
    })
    .on('end', () => {
      t.notOk(process.exitCode, 'it should not exit');
      t.end();
    })
    .run();
});

test('citgm: omg-i-pass from git url', (t) => {
  const options = {
    hmac: null,
    lookup: null,
    nodedir: null,
    level: null
  };

  const mod = 'git+https://github.com/MylesBorins/omg-i-pass';

  citgm
    .Tester(mod, options)
    .on('start', (name) => {
      t.equals(name, mod, 'it should be omg-i-pass');
    })
    .on('fail', (err) => {
      t.error(err);
    })
    .on('end', () => {
      t.notOk(process.exitCode, 'it should not exit');
      t.end();
    })
    .run();
});
