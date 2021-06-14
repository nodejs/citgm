import tap from 'tap';

import { spawn } from '../lib/spawn.js';

const { test } = tap;

test('spawn:', (t) => {
  t.plan(2);
  const child = spawn('echo', ['Hello world.']);

  let error = '';
  let message = '';

  const expectedMessage =
    process.platform === 'win32' ? '"Hello world."\r\n' : 'Hello world.\n';

  child.stderr.setEncoding('utf-8');
  child.stderr.on('data', (chunk) => {
    error += chunk;
  });

  child.stdout.setEncoding('utf-8');
  child.stdout.on('data', (chunk) => {
    message += chunk;
  });

  child.on('close', () => {
    t.equal(
      message,
      expectedMessage,
      'we should receive "Hello world." on stdout'
    );
    t.equal(error, '', 'there should be no data on stderr');
    t.end();
  });

  child.on('error', t.error);
});
