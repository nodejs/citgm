'use strict';
const path = require('path');

const stripAnsi = require('strip-ansi');
const which = require('which').sync;

const createOptions = require('../create-options');
const spawn = require('../spawn');
const timeout = require('../timeout');

function install(packageManager, context, next) {
  const options = createOptions(
    path.join(context.path, context.module.name),
    context
  );

  context.emit(
    'data',
    'info',
    `${context.module.name} ${packageManager}:`,
    `${packageManager} install started`
  );

  context.emit(
    'data',
    'verbose',
    `${context.module.name} ${packageManager}:`,
    `Using temp directory: "${options.env['npm_config_tmp']}"`
  );

  let nodeBin = 'node';
  if (context.options.testPath) {
    options.env.PATH = `${context.options.testPath}:${process.env.PATH}`;
    nodeBin = which('node', {
      path: options.env.PATH || process.env.PATH
    });
  }

  const packageManagerBin =
    packageManager === 'npm' ? context.npmPath : context.yarnPath;

  let args = [packageManagerBin, 'install'];
  if (context.module.install) {
    args = args.concat(context.module.install);
  }

  const binDirectory = path.dirname(packageManagerBin);
  options.env.PATH = `${binDirectory}:${process.env.PATH}`;

  const proc = spawn(nodeBin, args, options);
  const finish = timeout(context, proc, next, 'Install');

  proc.stderr.on('data', (chunk) => {
    context.testError.append(chunk);
    if (context.module.stripAnsi) {
      chunk = stripAnsi(chunk.toString());
      chunk = chunk.replace(/\r/g, '\n');
    }
    context.emit(
      'data',
      'warn',
      `${context.module.name} ${packageManager}-install:`,
      chunk.toString()
    );
  });

  proc.stdout.on('data', (chunk) => {
    context.testOutput.append(chunk);
    if (context.module.stripAnsi) {
      chunk = stripAnsi(chunk.toString());
      chunk = chunk.replace(/\r/g, '\n');
    }
    context.emit(
      'data',
      'verbose',
      `${context.module.name} ${packageManager}-install:`,
      chunk.toString()
    );
  });

  proc.on('error', () => {
    return finish(new Error('Install Failed'));
  });

  proc.on('close', (code) => {
    if (code > 0) {
      return finish(Error('Install Failed'));
    }
    context.emit(
      'data',
      'info',
      `${context.module.name} ${packageManager}:`,
      `${packageManager} install successfully completed`
    );
    return finish(null, context);
  });
}

module.exports = install;
