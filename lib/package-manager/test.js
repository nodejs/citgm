'use strict';

const path = require('path');

const readPackage = require('read-package-json');
const stripAnsi = require('strip-ansi');
const which = require('which').sync;

const createOptions = require('../create-options');
const spawn = require('../spawn');
const timeout = require('../timeout');

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
    let bin = 'node';
    if (context.options.testPath) {
      options.env.PATH = `${context.options.testPath}${envSeparator}${
        process.env.PATH
      }`;
      bin = which('node', { path: options.env.PATH });
    }

    const packageManagerBin =
      packageManager === 'npm' ? context.npmPath : context.yarnPath;

    const binDirectory = path.dirname(packageManagerBin);
    options.env.PATH = `${binDirectory}${envSeparator}${options.env.PATH ||
      process.env.PATH}`;

    /* Run `npm/yarn test`, or `/path/to/customTest.js` if the customTest option
     was passed */
    let scripts;
    if (context.options.customTest) {
      scripts = [[context.options.customTest]];
    } else if (context.module.scripts) {
      scripts = context.module.scripts.map((script) => [
        packageManagerBin,
        'run',
        script
      ]);
    } else {
      scripts = [[packageManagerBin, 'test']];
    }
    context.emit(
      'data',
      'silly',
      `${context.module.name} npm-test:`,
      `Scripts to execute: ${JSON.stringify(scripts)}.`
    );
    context.scripts = scripts;
    context.scriptsIter = scripts.keys();
    const runScript = (err, context) => {
      if (err) {
        return next(err, context);
      }
      const scriptIndex = context.scriptsIter.next();
      if (scriptIndex.done) {
        return next(err, context);
      }
      const args = context.scripts[scriptIndex.value];
      context.emit(
        'data',
        'silly',
        `${context.module.name} npm-test:`,
        `Running script ${JSON.stringify(args)}.`
      );

      const proc = spawn(bin, args, options);
      const finish = timeout(context, proc, runScript, 'Test');

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
    };

    runScript(null, context);
  });
}

module.exports = test;
