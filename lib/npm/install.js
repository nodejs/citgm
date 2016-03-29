'use strict';

// node modules
var path = require('path');

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
  if (context.options.nodedir) {
    var nodedir = path.resolve(process.cwd(), context.options.nodedir);
    options.env.npm_config_nodedir = nodedir;
    args.push('--nodedir="' + nodedir + '"');
    context.emit('data', 'verbose','nodedir', 'Using --nodedir="' + nodedir + '"');
  }
  var proc = spawn('npm', args, options);
  proc.stderr.on('data', function (chunk) {
    context.emit('data', 'warn', 'npm-install:', chunk.toString());
  });
  proc.stdout.on('data', function (chunk) {
    context.emit('data', 'verbose', 'npm-install:', chunk.toString());
  });
  proc.on('error', function() {
    bailed = true;
    context.emit('data', 'error', 'npm-install:', 'Install Failed');
    proc.kill();
    return next(Error('Install Failed'));
  });
  proc.on('close', function(code) {
    if (bailed) return;
    if (code > 0) {
      return next(Error('Install Failed'));
    }
    context.emit('data', 'info', 'npm:', 'install successfully completed');
    return next(null, context);
  });
}

module.exports = install;
