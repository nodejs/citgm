'use strict';

var test = require('tap').test;
var rewire = require('rewire');

var spawn = rewire('../lib/spawn');

test('spawn:', function (t) {
  var child = spawn('echo', ['Hello world.']);

  var error = '';
  var message = '';

  child.stdout.on('data', function (chunk) {
    message += chunk;
  });

  child.on('close', function () {
    t.equals(message,
        'Hello world.\n', 'we should receive "Hello world." on stdout');
    t.equals(error, '', 'there should be no data on stderr');
    t.end();
  });

  child.on('error', t.error);
});

test('spawn: windows mock', function (t) {
  var child = spawn.__get__('child');
  var sp = child.spawn;
  var platform = process.platform;
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

  var result = spawn('echo', ['Hello world.']);
  var expected = {
    cmd: 'cmd',
    args: [
      '/c',
      'echo',
      'Hello world.'
    ],
    options: undefined
  };

  child.spawn = sp;
  Object.defineProperty(process, 'platform', {
    value: platform
  });

  t.deepEqual(result, expected,
        'we should have the expected options for win32');
  t.end();
});
