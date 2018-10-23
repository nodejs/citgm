'use strict';
const chalk = require('chalk');
const columnify = require('columnify');
const logger = require('winston');
let supportsColor = require('supports-color'); // Mocked in tests

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  prettyPrint: true,
  depth: 100
});

function output(tag, message, dest) {
  let obj;
  if (typeof message === 'object') {
    obj = JSON.stringify(message, null, 2);
    message = '';
  }
  const msg = columnify([{ tag: tag, message: message }], {
    showHeaders: false,
    maxLineWidth: 'auto',
    minWidth: 20,
    maxWidth: Infinity,
    columnSplitter: '| ',
    preserveNewLines: true
  });
  msg.split('\n').forEach((line) => {
    dest(line);
  });
  if (obj) {
    obj.split('\n').forEach((line) => {
      dest(line);
    });
  }
}

module.exports = function(options) {
  let colorize;
  options = options || {
    level: 'warn'
  };
  colorize = !options.noColor && supportsColor.stdout && supportsColor.stderr;
  logger.level = options.level;
  if (colorize) logger.cli();
  return {
    silly: function(tag, message) {
      if (colorize) tag = chalk.green(tag);
      output(tag, message, logger.silly);
    },
    verbose: function(tag, message) {
      if (colorize) tag = chalk.cyan(tag);
      output(tag, message, logger.verbose);
    },
    info: function(tag, message) {
      // If (colorize) tag = chalk.cyan(tag);
      output(tag, message, logger.info);
    },
    warn: function(tag, message) {
      if (colorize) tag = chalk.yellow(tag);
      output(tag, message, logger.warn);
    },
    error: function(tag, message) {
      if (colorize) tag = chalk.red(tag);
      output(tag, message, logger.error);
    },
    bypass: function(messgage) {
      process.stdout.write(`${messgage}\n`);
    }
  };
};
