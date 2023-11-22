import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { windows } from './citgm.js';

export function commonArgs() {
  const app = yargs(hideBin(process.argv))
    .alias('help', 'h')
    .config()
    .env('CITGM')
    .option('verbose', {
      alias: ['v', 'loglevel'],
      choices: ['silly', 'verbose', 'info', 'warn', 'error'],
      default: 'info',
      description: 'Verbose output'
    })
    .option('npm-loglevel', {
      alias: 'q',
      choices: ['silly', 'verbose', 'info', 'warn', 'error', 'http', 'silent'],
      default: 'error',
      description: 'Verbose output for npm'
    })
    .option('lookup', {
      alias: 'l',
      type: 'string',
      description: 'Use the lookup table provided at <path>'
    })
    .option('nodedir', {
      alias: 'd',
      type: 'string',
      description: 'Path to the node source to use when compiling native addons'
    })
    .option('tmpDir', {
      type: 'string',
      description: 'Directory to test modules in'
    })
    .option('test-path', {
      alias: 'p',
      type: 'string',
      description: 'Path to prepend to $PATH when running tests'
    })
    .option('append', {
      alias: 'a',
      type: 'boolean',
      description: 'Append results to file rather than replace'
    })
    .option('no-color', {
      alias: 'n',
      type: 'boolean',
      description: 'Turns off colorized output'
    })
    .option('su', {
      alias: 's',
      type: 'boolean',
      description: 'Allow running the tool as root.'
    })
    .option('markdown', {
      alias: 'm',
      type: 'boolean',
      description: 'Output results in markdown'
    })
    .option('tap', {
      alias: 't',
      description: 'Output results in tap with optional file path'
    })
    .option('customTest', {
      type: 'string',
      description: 'Run a custom node test script instead of "npm test"'
    })
    .option('junit', {
      alias: 'x',
      description: 'Output results in junit xml with optional file path'
    })
    .option('timeout', {
      alias: 'o',
      type: 'number',
      description: 'Set timeout for `install` and `test` phases'
    })
    .option('yarn', {
      alias: 'y',
      type: 'boolean',
      description: 'Install and test the project using yarn instead of npm',
      default: false
    })
    .option('pnpm', {
      type: 'boolean',
      description: 'Install and test the project using pnpm instead of npm',
      default: false
    })
    .example(
      'citgm-all --customTest /path/to/customTest.js',
      'Runs a custom node test script instead of "npm test"'
    );

  if (!windows) {
    app
      .option('uid', {
        alias: 'u',
        type: 'number',
        description: 'Set the uid (posix only)'
      })
      .option('gid', {
        alias: 'g',
        type: 'number',
        description: 'Set the gid (posix only)'
      });
  }

  return app;
}
