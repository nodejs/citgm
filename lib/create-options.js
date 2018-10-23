'use strict';
const _ = require('lodash');
const path = require('path');

function createOptions(cwd, context) {
  const options = {
    cwd: cwd
  };
  if (!(process.platform === 'win32')) {
    if (context.options.uid) options.uid = context.options.uid;
    if (context.options.gid) options.gid = context.options.gid;
  }
  options.env = Object.create(process.env);
  options.env['npm_loglevel'] = context.options.npmLevel;
  options.env['npm_config_tmp'] = context.npmConfigTmp;

  if (context.options.nodedir) {
    const nodedir = path.resolve(process.cwd(), context.options.nodedir);
    options.env['npm_config_nodedir'] = nodedir;
    context.emit('data', 'verbose', `${context.module.name} nodedir`,
        `Using nodedir "${nodedir}"`);
  }

  if (context.module && context.module.envVar) {
    _.forEach(context.module.envVar, (val, key) => {
      options.env[key] = val;
    });
  }
  return options;
}

module.exports = createOptions;
