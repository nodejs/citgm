import { join, dirname } from 'path';
import { promisify } from 'util';

import readPackageJson from 'read-package-json';
import stripAnsi from 'strip-ansi';
import which from 'which';

const readPackage = promisify(readPackageJson);

import { createOptions } from '../create-options.js';
import { spawn } from '../spawn.js';
import { timeout } from '../timeout.js';

const envSeparator = process.platform === 'win32' ? ';' : ':';

export function authorName(author) {
  if (typeof author === 'string') return author;
  let parts = [];
  if (author.name) parts.push(author.name);
  if (author.email) parts.push(`<${author.email}>`);
  if (author.url) parts.push(`(${author.url})`);
  return parts.join(' ');
}

export async function test(packageManager, context) {
  const wd = join(context.path, context.module.name);
  context.emit(
    'data',
    'info',
    `${context.module.name} ${packageManager}:`,
    'test suite started'
  );
  let data;
  try {
    data = await readPackage(join(wd, 'package.json'), false);
    // Explicitly set the version to the value in the downloaded package.json.
    context.module.version = data.version;
  } catch {
    throw new Error('Package.json Could not be found');
  }
  if (
    data.scripts === undefined ||
    (data.scripts.test === undefined && context.module.scripts === undefined)
  ) {
    if (data.author) {
      context.emit(
        'data',
        'warn',
        `${context.module.name} notice`,
        `Please contact the module developer to request adding ${packageManager}` +
          ` test support: ${authorName(data.author)}`
      );
    }
    throw new Error(`Module does not support ${packageManager}-test!`);
  }

  const options = createOptions(wd, context);
  let bin = 'node';
  if (context.options.testPath) {
    options.env.PATH = `${context.options.testPath}${envSeparator}${process.env.PATH}`;
    bin = await which('node', { path: options.env.PATH });
  }

  let packageManagerBin = context.npmPath;
  if (packageManager === 'yarn') {
    packageManagerBin = context.yarnPath;
  } else if (packageManager === 'pnpm') {
    packageManagerBin = context.pnpmPath;
  }

  const binDirectory = dirname(packageManagerBin);
  options.env.PATH = `${binDirectory}${envSeparator}${
    options.env.PATH || process.env.PATH
  }`;

  /* Run `npm/yarn/pnpm test`, or `/path/to/customTest.js` if the customTest
     option was passed */
  let scripts;
  if (context.options.customTest) {
    scripts = [[context.options.customTest]];
  } else if (context.module.scripts) {
    scripts = context.module.scripts.map((script) => [
      packageManagerBin,
      'run',
      ...script.split(' ')
    ]);
  } else {
    scripts = [[packageManagerBin, 'test']];
  }
  context.emit(
    'data',
    'silly',
    `${context.module.name} ${packageManager}-test:`,
    `Scripts to execute: ${JSON.stringify(scripts)}.`
  );
  context.scripts = scripts;
  context.scriptsIter = scripts.keys();

  return new Promise((resolve, reject) => {
    const runScript = (err) => {
      if (err) {
        return reject(err);
      }
      const scriptIndex = context.scriptsIter.next();
      if (scriptIndex.done) {
        return resolve();
      }
      const args = context.scripts[scriptIndex.value];
      context.emit(
        'data',
        'silly',
        `${context.module.name} ${packageManager}-test:`,
        `Running script ${JSON.stringify(args)}.`
      );

      const proc = spawn(bin, args, options);
      const finish = timeout(
        packageManager,
        context,
        proc,
        runScript,
        'Test',
        context.module.timeout
      );

      proc.stdout.on('data', (data) => {
        context.testOutput.append(data);
        if (context.module.stripAnsi) {
          data = stripAnsi(data.toString());
          data = data.replace(/\r/g, '\n');
        }
        context.emit(
          'data',
          'verbose',
          `${context.module.name} ${packageManager}-test:`,
          data.toString()
        );
      });
      proc.stderr.on('data', (data) => {
        context.testError.append(data);
        context.emit(
          'data',
          'verbose',
          `${context.module.name} ${packageManager}-test:`,
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

    runScript();
  });
}
