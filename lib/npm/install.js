'use strict';
const path = require('path');

const stripAnsi = require('strip-ansi');

const createOptions = require('../create-options');
const spawn = require('../spawn');

function install(context, next) {
  const options =
    createOptions(
      path.join(context.path, context.module.name), context);
  let args = ['install', '--loglevel', context.options.npmLevel];
  let bailed = false;
  context.emit('data', 'info', context.module.name + ' npm:',
      'npm install started');

  context.emit('data', 'verbose', context.module.name + ' npm:',
    'Using temp directory: "' + options.env['npm_config_tmp'] + '"');

  if (context.module.install) {
    args = args.concat(context.module.install);
  }

  if (context.options.nodedir) {
    let nodedir = path.resolve(process.cwd(), context.options.nodedir);
    options.env.npm_config_nodedir = nodedir;
    if (process.platform === 'win32') {
      nodedir = nodedir.replace(/\\/g, '\\\\');
    }
    args.push('--nodedir="' + nodedir + '"');
    context.emit('data', 'verbose', context.module.name + ' nodedir',
        'Using --nodedir="' + nodedir + '"');
  }

  const proc = spawn('npm', args, options);

  // Default timeout to 10 minutes if not provided
  const timeout = setTimeout(cleanup, context.options.timeoutLength
        || 1000 * 60 * 10);

  function cleanup() {
    clearTimeout(timeout);
    bailed = true;
    context.module.flaky = true;
    context.emit('data', 'error', context.module.name + ' npm:',
        'npm-install Timed Out');
    proc.kill();
    return next(Error('Install Timed Out'));
  }

  proc.stderr.on('data', function (chunk) {
    context.testError.append(chunk);
    if (context.module.stripAnsi) {
      chunk = stripAnsi(chunk.toString());
      chunk = chunk.replace(/\r/g, '\n');
    }
    context.emit('data', 'warn', context.module.name + ' npm-install:',
      chunk.toString());
  });

  proc.stdout.on('data', function (chunk) {
    context.testOutput.append(chunk);
    if (context.module.stripAnsi) {
      chunk = stripAnsi(chunk.toString());
      chunk = chunk.replace(/\r/g, '\n');
    }
    context.emit('data', 'verbose', context.module.name + ' npm-install:',
      chunk.toString());
  });

  proc.on('error', function() {
    bailed = true;
    clearTimeout(timeout);
    return next(new Error('Install Failed'));
  });

  proc.on('close', function(code) {
    if (bailed) return;
    clearTimeout(timeout);
    if (code > 0) {
      return next(Error('Install Failed'));
    }
    context.emit('data', 'info', context.module.name + ' npm:',
        'npm install successfully completed');
    return next(null, context);
  });
}

module.exports = install;
