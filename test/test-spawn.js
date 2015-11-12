'use strict';

var test = require('tap').test;

var spawn = require('../lib/spawn');

test('spawn:', function (t) {
  var child = spawn('echo', ['Hello world.']);
  
  var error = '';
  var message = '';
  
  child.stdout.on('data', function (chunk) {
    message += chunk;
  });

  child.on('close', function () {
    t.equals(message, 'Hello world.\n', 'we should receive "Hello world." on stdout');
    t.equals(error, '', 'there should be no data on stderr')
    t.end();
  });

  child.on('error', t.error);
});
