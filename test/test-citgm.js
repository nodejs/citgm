'use strict';

const { test } = require('tap');

const citgm = require('../lib/citgm');

test('citgm: omg-i-pass', (t) => {
  t.plan(2);
  const options = {
    hmac: null,
    lookup: null,
    nodedir: null,
    level: null
  };

  const mod = 'omg-i-pass';

  new citgm.Tester(mod, options)
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
  t.plan(3);

  const options = {
    hmac: null,
    lookup: null,
    nodedir: null,
    level: null
  };

  const mod = 'git+https://github.com/MylesBorins/omg-i-pass';

  const tester = new citgm.Tester(mod, options);
  tester
    .on('start', (name) => {
      t.equals(name, mod, 'it should be the raw URL');
      t.equals(
        tester.module.name,
        `noname-44e9e903ceed542df23ff575629965f65eeaa51a`
      );
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
