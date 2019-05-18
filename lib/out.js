import chalk from 'chalk';
import columnify from 'columnify';
import winston from 'winston';
import * as supportsColor from 'supports-color';

const { createLogger, format, transports } = winston;

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

export function logger(options) {
  let colorize;
  options = options || {
    level: 'warn',
    silent: false
  };
  colorize = !options.noColor && supportsColor.stdout && supportsColor.stderr;

  const prettyFormat = format.prettyPrint({ depth: 100 });
  const logger = createLogger({
    level: options.level,
    silent: options.silent,
    transports: [
      new transports.Console({
        format: colorize
          ? format.combine(prettyFormat, format.cli())
          : format.combine(prettyFormat, format.simple())
      })
    ]
  });

  return {
    silly: function (tag, message) {
      if (colorize) tag = chalk.green(tag);
      output(tag, message, logger.silly);
    },
    verbose: function (tag, message) {
      if (colorize) tag = chalk.cyan(tag);
      output(tag, message, logger.verbose);
    },
    info: function (tag, message) {
      // If (colorize) tag = chalk.cyan(tag);
      output(tag, message, logger.info);
    },
    warn: function (tag, message) {
      if (colorize) tag = chalk.yellow(tag);
      output(tag, message, logger.warn);
    },
    error: function (tag, message) {
      if (colorize) tag = chalk.red(tag);
      output(tag, message, logger.error);
    },
    bypass: function (messgage) {
      process.stdout.write(`${messgage}\n`);
    }
  };
}
