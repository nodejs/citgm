'use strict';

const path = require('path');

const stripAnsi = require('strip-ansi');

const createOptions = require('../create-options');
const spawn = require('../spawn');
const timeout = require('../timeout');

const envSeparator = process.platform === 'win32' ? ';' : ':';

function install(packageManager, context) {
  return new Promise((resolve, reject) => {
    const options = createOptions(
      path.join(context.path, context.module.name),
      context
    );
    let args = ['install'];
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

    if (context.module.install) {
      args = args.concat(context.module.install);
    }

    const packageManagerBin =
      packageManager === 'npm' ? context.npmPath : context.yarnPath;

    const binDirectory = path.dirname(packageManagerBin);
    options.env.PATH = `${binDirectory}${envSeparator}${process.env.PATH}`;

    const proc = spawn(packageManagerBin, args, options);
    const finish = timeout(
      context,
      proc,
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      },
      'Install'
    );

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
  });
}

module.exports = install;
