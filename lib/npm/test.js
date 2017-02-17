'use strict';
const fs = require('fs');
const path = require('path');

const readPackage = require('read-package-json');
const stripAnsi = require('strip-ansi');
const which = require('which').sync;

const createOptions = require('../create-options');
const script = require('./script');
const spawn = require('../spawn');

const windows = (process.platform === 'win32');
let nodeBinName = 'node'; // Mocked in tests
const npmBinName = 'npm';

function authorName(author) {
  if (typeof author === 'string') return author;
  let parts = [];
  if (author.name) parts.push(author.name);
  if (author.email) parts.push('<' + author.email + '>');
  if (author.url) parts.push('(' + author.url + ')');
  return parts.join(' ');
}

function test(context, next) {
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
  const wd = path.join(context.path, context.module.name);
  context.emit('data', 'info', context.module.name + ' npm:',
      'test suite started');
  readPackage(path.join(wd, 'package.json'), false, function(err, data) {
    if (err) {
      next(new Error('Package.json Could not be found'));
      return;
    }
    if (data.scripts === undefined ||
        data.scripts.test === undefined) {
      if (data.author) {
        context.emit('data', 'warn', context.module.name + ' notice',
          'Please contact the module developer to request adding npm' +
          ' test support: ' + authorName(data.author));
      }
      next(new Error('Module does not support npm-test!'));
      return;
    }

    const options = createOptions(wd, context);
    let nodeBin = 'node';
    if (context.options.testPath) {
      options.env.PATH = context.options.testPath + ':' + process.env.PATH;
      nodeBin = which(nodeBinName, {path: options.env.PATH
            || process.env.PATH});
    }
    var npmBin = which(npmBinName, {path: options.env.PATH
          || process.env.PATH});
    if (windows) {
      npmBin = path.join(path.dirname(npmBin), 'node_modules', 'npm', 'bin',
          'npm-cli.js');
    }
    const proc = spawn(nodeBin, [npmBin, 'test', '--loglevel=' +
        context.options.npmLevel], options);
    proc.stdout.on('data', function (data) {
      if (context.module.stripAnsi) {
        data = stripAnsi(data.toString());
        data = data.replace(/\r/g, '\n');
      }
      context.testOutput += data;
      context.emit('data', 'verbose', context.module.name + ' npm-test:',
          data.toString());
    });
    proc.stderr.on('data', function (data) {
      context.testError += data;
      context.emit('data', 'verbose', context.module.name + ' npm-test:',
          data.toString());
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
