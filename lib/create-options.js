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
  options.env['npm_loglevel'] = 'error';
  options.env['npm_config_tmp'] = context.npmConfigTmp;

  if (context.module && context.module.envVar) {
    _.forEach(context.module.envVar, function (val, key) {
      options.env[key] = val;
    });
  }

  if (context.module && context.module.verifyNodeGyp !== undefined) {
    if (process.env['npm_config_node_gyp']) {
      options.env['citgm_node_gyp_bin_filename'] =
        process.env['npm_config_node_gyp'];
    } else {
      options.env['citgm_node_gyp_bin_filename'] = path.join(__dirname, '..',
                                                             'node_modules',
                                                             'node-gyp',
                                                             'bin',
                                                             'node-gyp.js');
    }
    options.env['npm_config_node_gyp'] = path.join(__dirname,
                                                   'citgm-node-gyp.js');
  }

  return options;
}

module.exports = createOptions;
