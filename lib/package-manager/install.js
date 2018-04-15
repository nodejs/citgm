'use strict';
const path = require('path');

const stripAnsi = require('strip-ansi');

const createOptions = require('../create-options');
const spawn = require('../spawn');
const timeout = require('../timeout');

function install(packageManager, context, next) {
  const options =
    createOptions(
      path.join(context.path, context.module.name), context);
  let args = ['install'];
  context.emit('data', 'info', context.module.name + ' ' + packageManager +
    ':',
    packageManager + ' install started');

  context.emit('data', 'verbose', context.module.name + ' ' + packageManager +
    ':',
    'Using temp directory: "' + options.env['npm_config_tmp'] + '"');

  if (context.module.install) {
    args = args.concat(context.module.install);
  }

  const proc = spawn(packageManager, args, options);
  const finish = timeout(context, proc, next, 'Install');

  proc.stderr.on('data', function (chunk) {
    context.testError.append(chunk);
    if (context.module.stripAnsi) {
      chunk = stripAnsi(chunk.toString());
      chunk = chunk.replace(/\r/g, '\n');
    }
    context.emit('data', 'warn', context.module.name +
      ' ' + packageManager + '-install:',
      chunk.toString());
  });

  proc.stdout.on('data', function (chunk) {
    context.testOutput.append(chunk);
    if (context.module.stripAnsi) {
      chunk = stripAnsi(chunk.toString());
      chunk = chunk.replace(/\r/g, '\n');
    }
    context.emit('data', 'verbose', context.module.name +
      ' ' + packageManager + '-install:',
      chunk.toString());
  });

  proc.on('error', function () {
    return finish(new Error('Install Failed'));
  });

  proc.on('close', function (code) {
    if (code > 0) {
      return finish(Error('Install Failed'));
    }
    context.emit('data', 'info', context.module.name + ' ' +
      packageManager + ':',
      packageManager + ' install successfully completed');
    return finish(null, context);
  });
}

module.exports = install;
