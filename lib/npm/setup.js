'use strict';

// node modules
var path = require('path');

// local modules
var spawn = require('../spawn');
var createOptions = require('../create-options');


function setup(context, next) {
  var options =
    createOptions(
      path.join(context.path, context.module.name), context);
  var args = ['install', '--loglevel=error'];
  context.emit('data', 'info', 'npm:', 'install started');
  if (context.options.nodedir) {
    var nodedir = path.resolve(process.cwd(),context.options.nodedir);
    options.env.npm_config_nodedir = nodedir;
    args.push('--nodedir="' + nodedir + '"');
    context.emit('data', 'verbose','nodedir', 'Using --nodedir="' + nodedir + '"');
  }
  var proc = spawn('npm', args, options);
  proc.stdout.on('data', function (data) {
    context.emit('data', 'silly', 'npm-install:', data.toString());
  });
  var error = '';
  proc.stderr.on('data', function (chunk) {
    error += chunk;
  });
  proc.on('error', function() {
    next(Error('Install Failed'));
  });
  proc.on('close', function(code) {
    if (error) {
      context.emit('data', 'error', 'npm-install:', error);
    }
    if (code > 0) {
      next(Error('Install Failed'));
      return;
    }
    context.emit('data', 'info', 'npm:', 'install successfully completed');
    next(null, context);
  });
}

module.exports = setup;
