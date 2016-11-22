'use strict';

// node modules
var path = require('path');

// local modules
var spawn = require('../spawn');
var createOptions = require('../create-options');
var VerifyNodeGyp = require('./verify-node-gyp');

function install(context, next) {
  var options =
    createOptions(
      path.join(context.path, context.module.name), context);
  var args = ['install', '--loglevel', context.options.npmLevel];
  var bailed = false;
  context.emit('data', 'info', 'npm:', 'install started');

  if (context.options.nodedir) {
    var nodedir = path.resolve(process.cwd(), context.options.nodedir);
    options.env.npm_config_nodedir = nodedir;
    if (process.platform === 'win32') {
      nodedir = nodedir.replace(/\\/g, '\\\\');
    }
    args.push('--nodedir="' + nodedir + '"');
    context.emit('data', 'verbose','nodedir', 'Using --nodedir="' + nodedir + '"');
  }

  var verifyNodeGyp;
  if (context.module.verifyNodeGyp) {
    verifyNodeGyp = new VerifyNodeGyp(context);
    verifyNodeGyp.setOptions(options);
  }
  context.emit('data', 'verbose', 'npm install args', JSON.stringify(args));
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

  proc.stderr.on('data', function (chunk) {
    context.emit('data', 'warn', 'npm-install:', chunk.toString());
  });

  proc.stdout.on('data', function (chunk) {
    context.emit('data', 'verbose', 'npm-install:', chunk.toString());
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
    if (verifyNodeGyp) {
      var nodeGypCalled = verifyNodeGyp.wasCalled();
      if (context.module.verifyNodeGypCalled && !nodeGypCalled)
        return next(new Error('node-gyp was not called'));
      if (context.module.verifyNodeGypNotCalled && nodeGypCalled)
        return next(new Error('node-gyp was called'));
    }
    context.emit('data', 'info', 'npm:', 'install successfully completed');
    return next(null, context);
  });
}

module.exports = install;
