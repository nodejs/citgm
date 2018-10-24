'use strict';
const path = require('path');

const stripAnsi = require('strip-ansi');
const which = require('which').sync;
const npmWhich = require('npm-which')(__dirname).sync;

const createOptions = require('../create-options');
const spawn = require('../spawn');
const timeout = require('../timeout');
const windows = (process.platform === 'win32');
const npmBinName = 'npm';
const yarnBinName = 'yarn';

function install(packageManager, context, next) {
  const useYarn = packageManager === 'yarn';
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

  let packageManagerBin;

  if (useYarn) {
    // Use `npm-which` for yarn to get the locally version
    packageManagerBin = npmWhich(yarnBinName, {path: options.env.PATH
        || process.env.PATH});
  } else {
    packageManagerBin = which(npmBinName, {path: options.env.PATH
        || process.env.PATH});
    if (windows) {
      packageManagerBin = path.join(path.dirname(packageManagerBin),
        'node_modules', 'npm', 'bin', 'npm-cli.js');
    }
  }

  const proc = spawn(packageManagerBin, args, options);
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

  proc.on('error', function() {
    return finish(new Error('Install Failed'));
  });

  proc.on('close', function(code) {
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
