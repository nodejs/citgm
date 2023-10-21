import { spawnSync } from 'child_process';
import path from 'path';

import stripAnsi from 'strip-ansi';
import semverLt from 'semver/functions/lt.js';

import { createOptions } from '../create-options.js';
import { spawn } from '../spawn.js';
import { timeout } from '../timeout.js';

const envSeparator = process.platform === 'win32' ? ';' : ':';

function getVersion(packageManager, context) {
  const options = createOptions(
    path.join(context.path, context.module.name),
    context
  );
  let packageManagerBin = context.npmPath;
  if (packageManager === 'yarn') {
    packageManagerBin = context.yarnPath;
  } else if (packageManager === 'pnpm') {
    packageManagerBin = context.pnpmPath;
  }

  const binDirectory = path.dirname(packageManagerBin);
  options.env.PATH = `${binDirectory}${envSeparator}${process.env.PATH}`;
  options.encoding = 'utf8';

  const proc = spawnSync(packageManagerBin, ['--version'], options);
  if (proc.status !== 0) {
    context.emit(
      'data',
      'warn',
      `${context.module.name} ${packageManager}:`,
      `Unable to determine ${packageManager} version:\n${proc.stdout}` +
        `\n${proc.stderr}`
    );
    return undefined;
  }
  context.emit(
    'data',
    'verbose',
    `${context.module.name} ${packageManager}:`,
    `${packageManager} version ${proc.stdout}`
  );
  return proc.stdout;
}

export default function install(packageManager, context) {
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

    if (packageManager === 'npm') {
      args.push('--no-audit');
      args.push('--no-fund');
    } else if (packageManager === 'yarn') {
      // Tell yarn versions earlier than v2 to ignore the "engines" field in
      // `package.json` (if present) to allow installation with unreleased
      // versions of Node.js.
      const version = getVersion(packageManager, context);
      if (version && semverLt(version, '2.0.0', { includePrerelease: true })) {
        options.env['YARN_IGNORE_ENGINES'] = 'true';
      }
    } else if (packageManager === 'pnpm') {
      // No pnpm-specific options yet
    }

    if (context.module.install) {
      args = context.module.install;
    }

    let packageManagerBin = context.npmPath;
    if (packageManager === 'yarn') {
      packageManagerBin = context.yarnPath;
    } else if (packageManager === 'pnpm') {
      packageManagerBin = context.pnpmPath;
    }

    const binDirectory = path.dirname(packageManagerBin);
    options.env.PATH = `${binDirectory}${envSeparator}${process.env.PATH}`;

    const proc = spawn(packageManagerBin, args, options);
    const finish = timeout(
      packageManager,
      context,
      proc,
      (err) => {
        if (err) {
          if (context.testError.length === 0) {
            // Because pnpm prints errors to stdout
            context.testError = context.testOutput;
          }
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
