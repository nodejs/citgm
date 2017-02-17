'use strict';
const fs = require('fs');
const path = require('path');
const util = require('util');

const stripAnsi = require('strip-ansi');

const createOptions = require('../../create-options');
const spawn = require('../../spawn');

function runScript(context, script, msg, next) {
  const _path = path.resolve(process.cwd(), script);
  if (typeof msg === 'function') {
    next = msg;
    msg = util.format('Script %s failed', _path);
  }
  context.emit('data', 'verbose', context.module.name + ' script-start', _path);
  fs.stat(_path, function(err, stat) {
    if (err || !stat.isFile()) {
      return next(err);
    }
    const options = createOptions(context.path, context);
    const proc = spawn(_path, [], options);
    proc.stdout.on('data', function (data) {
      if (context.module.stripAnsi) {
        data = stripAnsi(data.toString());
        data = data.replace(/\r/g, '\n');
      }
      context.testOutput += data;
      context.emit('data', 'verbose', context.module.name + ' npm-test:',
          data.toString());
    });
    proc.stderr.on('data', function (data) {
      context.testError += data;
      context.emit('data', 'verbose', context.module.name + ' npm-error:',
          data.toString());
    });
    proc.on('error', function(err) {
      next(err);
    });
    proc.on('close', function(code) {
      if (code > 0) {
        return next(Error(msg));
      }
      context.emit('data', 'verbose', context.module.name + ' script-end',
          _path);
      return next(null, context);
    });
  });
}

module.exports = runScript;
