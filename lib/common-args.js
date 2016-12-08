'use strict';
var citgm = require('./citgm');
var pkg = require('../package.json');

module.exports = function commonArgs (app) {
  app = app
  .version(pkg.version)
  .help()
  .alias('help', 'h')
  .config()
  .env('CITGM')
  .option('verbose', {
    alias: 'v',
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
  .option('junit', {
    alias: 'x',
    description: 'Output results in junit xml with optional file path'
  })
  .option('timeout', {
    alias: 'o',
    type: 'number',
    description: 'Set timeout for npm install',
    default: 1000 * 60 * 10
  });

  /* istanbul ignore else: platform specific for windows */
  if (!citgm.windows) {
    app = app.option('uid', {
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
};
