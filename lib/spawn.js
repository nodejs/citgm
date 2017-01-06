'use strict';
// Node modules
const child = require('child_process');

function spawn(cmd, args, options) {
  if (process.platform === 'win32') {
    args = ['/c', cmd].concat(args);
    cmd = 'cmd';
  }
  return child.spawn(cmd, args, options);
}

module.exports = spawn;
