'use strict';
const _ = require('lodash');

function createOptions(cwd, context) {
  const options = {
    cwd: cwd
  };
  if (!(process.platform === 'win32')) {
    if (context.options.uid) options.uid = context.options.uid;
    if (context.options.gid) options.gid = context.options.gid;
  }
  options.env = Object.create(process.env);
  options.env['npm_loglevel'] = 'error';
  options.env['npm_config_tmp'] = context.npmConfigTmp;

  if (context.module && context.module.envVar) {
    _.forEach(context.module.envVar, function (val, key) {
      options.env[key] = val;
    });
  }
  return options;
}

module.exports = createOptions;
