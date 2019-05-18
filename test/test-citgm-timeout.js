import tap from 'tap';

import { Tester } from '../lib/citgm.js';
import { __test__setRemove } from '../lib/temp-directory.js';

let expectedError;
__test__setRemove((context) => {
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
});

tap.test('citgm: omg-i-timeout from local path', (t) => {
  t.plan(4);

  const options = {
    hmac: null,
    lookup: null,
    nodedir: null,
    level: null,
    timeout: 30000
  };

  const mod = './test/fixtures/omg-i-timeout';

  const tester = new Tester(mod, options);
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
