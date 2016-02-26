'use strict';

// node modules
var path = require('path');

// npm modules
var readPackage = require('read-package-json');
var stripAnsi = require('strip-ansi');

// local modules
var spawn = require('../spawn');
var createOptions = require('../create-options');

function authorName(author) {
  if (typeof author === 'string') return author;
  else {
    var parts = [];
    if (author.name) parts.push(author.name);
    if (author.email) parts.push('<' + author.email + '>');
    if (author.url) parts.push('(' + author.url + ')');
    return parts.join(' ');
  }
}

function test(context, next) {
  var wd = path.join(context.path, context.module.name);
  context.emit('data', 'info', 'npm:', 'test suite started');
  readPackage(path.join(wd,'package.json'),false,function(err,data) {
    if (err) {
      next(new Error('Package.json Could not be found'));
      return;
    }
    if (data.scripts === undefined ||
        data.scripts.test === undefined) {
      if (data.author) {
        context.emit('data', 'warn', 'notice',
          'Please contact the module developer to request adding npm' +
          ' test support: ' + authorName(data.author));
      }
      next(new Error('Module does not support npm-test!'));
      return;
    }

    var options = createOptions(wd, context);
    var output = '';
    var proc = spawn('npm', ['test', '--loglevel=' + context.options.npmLevel], options);
    proc.stdout.on('data', function (data) {
      if (context.module.stripAnsi) {
        data = stripAnsi(data.toString());
        data = data.replace(/\r/g, '\n');
      }
      output += data;
      context.emit('data', 'verbose', 'npm-test:', data.toString());
    });
    var error = '';
    proc.stderr.on('data', function (chunk) {
      error += chunk;
    });
    proc.on('error', function() {
      next(new Error('Tests Failed'));
    });
    proc.on('close', function(code) {
      if (error) {
        context.emit('data', 'verbose', 'npm:', error);
      }
      if (output.length > 0) {
        context.module.testOutput = output + '\n' + error;
      }
      if (code > 0) {
        next(new Error('The canary is dead:'));
        return;
      }
      next(null, context);
    });

  });
}

module.exports = test;