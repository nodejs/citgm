var test = require('tap').test;

var createOptions = require('../lib/create-options');

test('create-options:', function (t) {
  var cwd = __dirname;

  var context = {
    options: {}
  };

  var env = Object.create(process.env);
  env.npm_loglevel = 'error';

  var options = createOptions(cwd, context);

  t.equals(typeof options, 'object', 'We should get back an object');
  t.notOk(options.uid, 'There should not be a uid in the options');
  t.notOk(options.gid, 'There should not be a gid in the options');
  t.deepequal(options.env, env, 'The created env should be a clone of process.env with the added npm_loglevel')
  t.done();
});

test('create-options: with uid / gid', function (t) {
  var cwd = __dirname;

  var context = {
    options: {
      uid: 1337,
      gid: 1337
    }
  };

  var options = createOptions(cwd, context);

  t.equals(typeof options, 'object', 'We should get back an object');
  t.equals(options.uid, 1337, 'The uid should be set to the expected value');
  t.equals(options.gid, 1337, 'The gid should be set to the expected value');
  t.done();
});
