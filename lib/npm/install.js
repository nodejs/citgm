'use strict';

// node modules
var path = require('path');

// npm modules
var stripAnsi = require('strip-ansi');

// local modules
var spawn = require('../spawn');
var createOptions = require('../create-options');

function install(context, next) {
  var options =
    createOptions(
      path.join(context.path, context.module.name), context);
  var args = ['install', '--loglevel', context.options.npmLevel];
  var bailed = false;
  context.emit('data', 'info', 'npm:', 'install started');

  if (context.module.install) {
    args = args.concat(context.module.install);
  }

  if (context.options.nodedir) {
    var nodedir = path.resolve(process.cwd(), context.options.nodedir);
    options.env.npm_config_nodedir = nodedir;
    /* istanbul ignore if: windows specific edge case */
    if (process.platform === 'win32') {
      nodedir = nodedir.replace(/\\/g, '\\\\');
    }
    args.push('--nodedir="' + nodedir + '"');
    context.emit('data', 'verbose','nodedir', 'Using --nodedir="' + nodedir + '"');
  }

  var proc = spawn('npm', args, options);

  // default timeout to 10 minutes if not provided
  var timeout = setTimeout(cleanup, context.options.timeoutLength || 1000 * 60 * 10);

  function cleanup() {
    clearTimeout(timeout);
    bailed = true;
    context.emit('data', 'error', 'npm-install:', 'Install Timed Out');
    proc.kill();
    return next(Error('Install Timed Out'));
  }

  var installOutput = '';
  var installError = '';

  proc.stderr.on('data', function (chunk) {
    if (context.module.stripAnsi) {
      chunk = stripAnsi(chunk.toString());
      chunk = chunk.replace(/\r/g, '\n');
    }
    context.emit('data', 'warn', 'npm-install:', chunk.toString());
    installError += chunk;
  });

  proc.stdout.on('data', function (chunk) {
    if (context.module.stripAnsi) {
      chunk = stripAnsi(chunk.toString());
      chunk = chunk.replace(/\r/g, '\n');
    }
    context.emit('data', 'verbose', 'npm-install:', chunk.toString());
    installOutput += chunk;
  });

  proc.on('error', function() {
    bailed = true;
    clearTimeout(timeout);
    context.testOutput = installOutput || '';
    context.testError = installError || '';
    return next(new Error('Install Failed'));
  });

  proc.on('close', function(code) {
    if (bailed) return;
    clearTimeout(timeout);
    if (code > 0) {
      context.testOutput = installOutput || '';
      context.testError = installError /* istanbul ignore next: rare edge case */ || '';
      return next(Error('Install Failed'));
    }
    context.emit('data', 'info', 'npm:', 'install successfully completed');
    return next(null, context);
  });
}

module.exports = install;
