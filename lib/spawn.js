'use strict';

const child = require('child_process');

function spawn(cmd, args, options) {
  if (process.platform === 'win32') {
    if (cmd === 'node') {
      cmd = args[0];
      args = args.slice(1);
    }
    if (cmd.endsWith('js')) {
      args = [cmd].concat(args);
      cmd = process.execPath;
    } else {
      // The /C option is capitalized to make tests work. Specifically, this
      // allows to bypass an issue in https://github.com/tapjs/spawn-wrap used
      // by https://github.com/istanbuljs/nyc to track code coverage.
      // The problem is that `mungeCmd()` (
      // https://github.com/tapjs/spawn-wrap/blob/7931ab5c/index.js#L143)
      // incorrectly replaces `spawn()` args.
      args = ['/C', cmd].concat(args).map((arg) => {
        return arg.replace(/\^/g, '^^^^');
      });
      cmd = 'cmd';
    }
  }
  return child.spawn(cmd, args, options);
}

module.exports = spawn;
