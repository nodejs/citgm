'use strict';

// node modules
var path = require('path');
var fs = require('fs');

// npm modules
var readPackage = require('read-package-json');
var stripAnsi = require('strip-ansi');
var which = require('which').sync;

// local modules
var spawn = require('../spawn');
var createOptions = require('../create-options');
var script = require('./script');

var windows = (process.platform === 'win32');

function authorName(author) {
  if (typeof author === 'string') return author;
  var parts = [];
  if (author.name) parts.push(author.name);
  if (author.email) parts.push('<' + author.email + '>');
  if (author.url) parts.push('(' + author.url + ')');
  return parts.join(' ');
}

function test(context, next) {
  var wd = path.join(context.path, context.module.name);
  var options = createOptions(wd, context);
  var nodeBin = 'node';
  if (context.options.testPath) {
    options.env.PATH = context.options.testPath + ':' + process.env.PATH;
    nodeBin = which('node', {path: options.env.PATH || process.env.PATH});
  }
  var npmBin = which('npm',  {path: options.env.PATH || process.env.PATH});
  if (windows) {
    npmBin = path.join(path.dirname(npmBin), 'node_modules', 'npm', 'bin', 'npm-cli.js');
  }

  if (context.module.script) {
    script.fetch(context, context.module.script, function(err, file) {
      if (err) {
        return next(err);
      }
      if (!windows) {
        fs.chmodSync(file, '755');
      }
      script.run(context, file, 'The canary is dead.', next);
    });

    return;
  }

  if (context.module.testCommand) {
    script.runTestCommand(nodeBin, npmBin, context, context.module.testCommand, next);
    return;
  }

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

    var proc = spawn(nodeBin, [npmBin, 'test', '--loglevel=' + context.options.npmLevel], options);
    proc.stdout.on('data', function (data) {
      if (context.module.stripAnsi) {
        data = stripAnsi(data.toString());
        data = data.replace(/\r/g, '\n');
      }
      context.testOutput += data;
      context.emit('data', 'verbose', 'npm-test:', data.toString());
    });
    proc.stderr.on('data', function (data) {
      context.testError += data;
      context.emit('data', 'verbose', 'npm-test:', data.toString());
    });
    proc.on('error', function() {
      next(new Error('Tests Failed'));
    });
    proc.on('close', function(code) {
      if (code > 0) {
        return next(new Error('The canary is dead:'));
      }
      return next(null, context);
    });

  });
}

module.exports = test;
