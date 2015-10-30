'use strict';
const logger = require('winston');
const chalk = require('chalk');
const supportscolor = require('supports-color');
const columnify = require('columnify');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  prettyPrint:true,
  depth: 100
});

function output(tag, message, dest) {
  var obj;
  if (typeof message === 'object') {
    obj = JSON.stringify(message,null,2);
    message = '';
  }
  var msg = columnify(
    [{tag:tag,message:message}],
    {
      showHeaders: false,
      maxLineWidth: 'auto',
      minWidth: 20,
      maxWidth: 50,
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
  var colorize = !options.nocolor && supportscolor;
  options = options || {
    level: 'warn'
  };
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
    }
  };
};
