'use strict';
const child = require('child_process');

function spawn(cmd, args, options) {
  if (process.platform === 'win32') {
    if (cmd.endsWith('js')) {
      args = [cmd].concat(args);
      cmd = process.execPath;
    } else {
      args = ['/c', cmd].concat(args);
      cmd = 'cmd';
    }
  }
  return child.spawn(cmd, args, options);
}

module.exports = spawn;
