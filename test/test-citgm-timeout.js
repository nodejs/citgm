'use strict';

const { test } = require('tap');
const rewire = require('rewire');
const citgm = rewire('../lib/citgm');
const { create } = require('../lib/temp-directory');
let expectedError;
citgm.__set__('tempDirectory', {
  create,
  remove: (context) => {
    // Simulate an error when removing the temporary directory.
    const err = new Error(
      `EBUSY: resource busy or locked, rmdir '${context.path}'`
    );
    err.errno = -4082;
    err.code = 'EBUSY';
    err.syscall = 'rmdir';
    err.path = context.path;
    expectedError = err;
    throw err;
  }
});

test('citgm: omg-i-timeout from local path', (t) => {
  t.plan(4);

  const options = {
    hmac: null,
    lookup: null,
    nodedir: null,
    level: null,
    timeout: 30000
  };

  const mod = './test/fixtures/omg-i-timeout';

  const tester = new citgm.Tester(mod, options);
  tester
    .on('start', (name) => {
      t.equal(name, mod, 'it should be the local path');
    })
    .on('data', (type, key, msg) => {
      if (type === 'error' && key.endsWith('cleanup')) {
        t.match(msg, expectedError, 'it should log cleanup error');
      }
    })
    .on('fail', (err) => {
      t.match(
        err,
        { name: 'Error', message: 'Test Timed Out' },
        'it should time out'
      );
    })
    .on('end', () => {
      t.notOk(tester.cleanexit, 'it should not cleanly exit');
      t.end();
    })
    .run();
});
