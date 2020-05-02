'use strict';

const { test } = require('tap');
const rewire = require('rewire');

const spawn = rewire('../lib/spawn');

test('spawn:', (t) => {
  t.plan(2);
  const child = spawn('echo', ['Hello world.']);

  let error = '';
  let message = '';

  const expectedMessage =
    process.platform === 'win32' ? '"Hello world."\r\n' : 'Hello world.\n';

  child.stderr.on('data', (chunk) => {
    error += chunk;
  });

  child.stdout.on('data', (chunk) => {
    message += chunk;
  });

  child.on('close', () => {
    t.equals(
      message,
      expectedMessage,
      'we should receive "Hello world." on stdout'
    );
    t.equals(error, '', 'there should be no data on stderr');
    t.end();
  });

  child.on('error', t.error);
});

test('spawn: windows mock', (t) => {
  t.plan(1);
  const child = spawn.__get__('child');
  const sp = child.spawn;
  const platform = process.platform;
  Object.defineProperty(process, 'platform', {
    value: 'win32'
  });

  child.spawn = function (cmd, args, options) {
    return {
      cmd: cmd,
      args: args,
      options: options
    };
  };

  const result = spawn('echo', ['Hello world.']);
  const expected = {
    cmd: 'cmd',
    args: ['/C', 'echo', 'Hello world.'],
    options: undefined
  };

  child.spawn = sp;
  Object.defineProperty(process, 'platform', {
    value: platform
  });

  t.deepEqual(
    result,
    expected,
    'we should have the expected options for win32'
  );
  t.end();
});
