'use strict';

const path = require('path');

const { test } = require('tap');

const createOptions = require('../lib/create-options');

test('create-options:', (t) => {
  t.plan(4);
  const cwd = __dirname;
  const nodePath = '/path/to/node';

  const context = {
    options: {
      nodedir: nodePath,
      npmLevel: 'warning'
    },
    emit: function() {},
    homeDir: 'homedir',
    npmConfigTmp: 'npm_config_tmp',
    module: { envVar: { testenvVar: 'thisisatest' } }
  };

  const options = createOptions(cwd, context);

  // Create a copy of process.env to set the properties added by createOptions
  // for the deepequal test.
  const env = Object.create(process.env);
  env['HOME'] = 'homedir';
  env['USERPROFILE'] = 'homedir';
  env['npm_config_loglevel'] = 'warning';
  env['npm_config_tmp'] = 'npm_config_tmp';
  env['testenvVar'] = 'thisisatest';
  env['TEMP'] = 'npm_config_tmp';
  env['TMP'] = 'npm_config_tmp';
  env['TMPDIR'] = 'npm_config_tmp';
  env['YARN_IGNORE_ENGINES'] = 'true';
  // Set dynamically to support Windows.
  env['npm_config_nodedir'] = path.resolve(process.cwd(), nodePath);

  t.equals(typeof options, 'object', 'We should get back an object');
  t.notOk(options.uid, 'There should not be a uid in the options');
  t.notOk(options.gid, 'There should not be a gid in the options');
  t.deepequal(
    options.env,
    env,
    'The created env should be a clone of' +
      ' process.env with the added npm_config_loglevel and nodedir'
  );
  t.end();
});

test('create-options: with uid / gid', (t) => {
  t.plan(3);
  const cwd = __dirname;

  const context = {
    options: {
      uid: 1337,
      gid: 1337
    }
  };

  const options = createOptions(cwd, context);

  t.equals(typeof options, 'object', 'We should get back an object');
  if (process.platform === 'win32') {
    t.equals(options.uid, undefined, 'The uid should not be set on Windows');
    t.equals(options.gid, undefined, 'The gid should not be set on Windows');
  } else {
    t.equals(options.uid, 1337, 'The uid should be set to the expected value');
    t.equals(options.gid, 1337, 'The gid should be set to the expected value');
  }
  t.end();
});
