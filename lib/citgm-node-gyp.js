#!/usr/bin/env node
/* eslint-disable no-console */
'use strict';

const child_process = require('child_process');

const node_gyp_filename = process.env['citgm_node_gyp_bin_filename'];
if (!node_gyp_filename) {
  process.exit(1);
}

const args = process.argv.slice(1);
if (args.indexOf('build') !== -1 || args.indexOf('rebuild') !== -1) {
  console.log('citgm-verify-node-gyp-called: node-gyp was called!');
}

delete process.env['npm_config_node_gyp'];
child_process.spawn(process.execPath, [node_gyp_filename].concat(args))
  .on('close', function(code) {
    process.exit(code);
  });
