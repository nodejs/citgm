'use strict';
var logger = require('winston');
var chalk = require('chalk');
var supportscolor = require('supports-color');
var columnify = require('columnify');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  prettyPrint:true,
  depth: 100
});

function output(tag, message, dest) {
  var obj;
  if (typeof message === 'object') {
    obj = JSON.stringify(message, null, 2);
    message = '';
  }
  var msg = columnify(
    [{tag:tag, message:message}],
    {
      showHeaders: false,
      maxLineWidth: 'auto',
      minWidth: 20,
      maxWidth: Infinity,
      columnSplitter: '| ',
      preserveNewLines: true
    }
  );
  msg.split('\n').forEach(function(line) {
    dest(line);
  });
  if (obj) {
    obj.split('\n').forEach(function(line) {
      dest(line);
    });
  }
}

module.exports = function(options) {
  var colorize;
  options = options || {
    level: 'warn'
  };
  colorize = !options.nocolor && supportscolor;
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
      // if (colorize) tag = chalk.cyan(tag);
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
      process.stdout.write(messgage + '\n');
    }
  };
};
