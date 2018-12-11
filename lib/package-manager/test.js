'use strict';
const path = require('path');

const readPackage = require('read-package-json');
const stripAnsi = require('strip-ansi');
const which = require('which').sync;

const createOptions = require('../create-options');
const spawn = require('../spawn');
const timeout = require('../timeout');

let nodeBinName = 'node'; // Mocked in tests

const envSeparator = process.platform === 'win32' ? ';' : ':';

function authorName(author) {
  if (typeof author === 'string') return author;
  let parts = [];
  if (author.name) parts.push(author.name);
  if (author.email) parts.push(`<${author.email}>`);
  if (author.url) parts.push(`(${author.url})`);
  return parts.join(' ');
}

function test(packageManager, context, next) {
  const wd = path.join(context.path, context.module.name);
  context.emit(
    'data',
    'info',
    `${context.module.name} ${packageManager}:`,
    'test suite started'
  );
  readPackage(path.join(wd, 'package.json'), false, (err, data) => {
    if (err) {
      next(new Error('Package.json Could not be found'));
      return;
    }
    if (data.scripts === undefined || data.scripts.test === undefined) {
      if (data.author) {
        context.emit(
          'data',
          'warn',
          `${context.module.name} notice`,
          `Please contact the module developer to request adding ${packageManager}` +
            ` test support: ${authorName(data.author)}`
        );
      }
      next(new Error(`Module does not support ${packageManager}-test!`));
      return;
    }

    const options = createOptions(wd, context);
    let nodeBin = 'node';
    if (context.options.testPath) {
      options.env.PATH = `${context.options.testPath}${envSeparator}${process.env.PATH}`;
      nodeBin = which(nodeBinName, {
        path: options.env.PATH || process.env.PATH
      });
    }

    const packageManagerBin =
      packageManager === 'npm' ? context.npmPath : context.yarnPath;

    const binDirectory = path.dirname(packageManagerBin);
    options.env.PATH = `${binDirectory}${envSeparator}${process.env.PATH}`;

    /* Run `npm/yarn test`, or `/path/to/customTest.js` if the customTest option
     was passed */
    const args = context.options.customTest
      ? [context.options.customTest]
      : [packageManagerBin, 'test'];

    const proc = spawn(nodeBin, args, options);
    const finish = timeout(context, proc, next, 'Test');

    proc.stdout.on('data', (data) => {
      context.testOutput.append(data);
      if (context.module.stripAnsi) {
        data = stripAnsi(data.toString());
        data = data.replace(/\r/g, '\n');
      }
      context.emit(
        'data',
        'verbose',
        `${context.module.name} npm-test:`,
        data.toString()
      );
    });
    proc.stderr.on('data', (data) => {
      context.testError.append(data);
      context.emit(
        'data',
        'verbose',
        `${context.module.name} npm-test:`,
        data.toString()
      );
    });
    proc.on('error', () => {
      finish(new Error('Tests Failed'));
    });
    proc.on('close', (code) => {
      if (code > 0) {
        return finish(new Error('The canary is dead:'));
      }
      return finish(null, context);
    });
  });
}

module.exports = test;
