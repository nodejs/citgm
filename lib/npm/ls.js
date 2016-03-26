'use strict';

// node modules
var path = require('path');

// local modules
var spawn = require('../spawn');
var createOptions = require('../create-options');

function ls(context, next) {
  var options =
    createOptions(
      path.join(context.path, context.module.name), context);

  var args = ['ls', '--loglevel', context.options.npmLevel];

  context.emit('data', 'info', 'npm:', 'ls started');

  var proc = spawn('npm', args, options);

  proc.stderr.on('data', function (chunk) {
    context.emit('data', 'warn', 'npm-ls:', chunk.toString());
  });

  proc.stdout.on('data', function (chunk) {
    context.emit('data', 'info', 'npm-ls:', chunk.toString());
  });

  proc.on('close', function(code) {
    if (code) {
      return next(new Error('Dependency tree is incorrect.'));
    }
    context.emit('data', 'info', 'npm:', 'Dependency tree is correct');
    return next(code, context);
  });
}

module.exports = ls;
