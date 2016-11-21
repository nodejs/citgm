'use strict';

var _ = require('lodash');
var chalk = require('chalk');

var util = require('./util');

function logModule(log, logType, module) {
  log[logType](chalk.yellow('module name:'), module.name);
  if (module.test) {
    log[logType](chalk.yellow('test:'), module.test);
  }
  log[logType](chalk.yellow('version:'), module.version);
  if (module.error) {
    log[logType]('error:', module.error.message);
    log[logType]('error:', module.testOutput);
  }
}

function logModules(log, logType, modules) {
  _.each(modules, function (module) {
    logModule(log, logType, module);
  });
}

function logger(log, modules) {
  if (!(modules instanceof Array)) {
    modules = [modules];
  }
  var passed = util.getPassing(modules);
  var flaky = util.getFlakyFails(modules);
  var failed = util.getFails(modules);

  if (passed.length > 0) {
    log.info('passing module(s)');
    logModules(log, 'info', passed);
  }
  if (flaky.length > 0) {
    log.warn('flaky module(s)');
    logModules(log, 'warn', flaky);
  }
  if (failed.length > 0) {
    log.error('failing module(s)');
    logModules(log, 'error', failed);
    log.error('done', 'The smoke test has failed.');
  }
  else {
    log.info('done', 'The smoke test has passed.');
  }
}

module.exports = logger;
