'use strict';
const _ = require('lodash');

const util = require('./util');

function printModulesMarkdown(logger, title, modules) {
  if (modules.length > 0) {
    logger('### ' + title + ' Modules');
    _.each(modules, function (mod) {
      logger('  * ' + mod.name + ' v' + mod.version + ' duration:' +
          mod.duration + 'ms');
      if (mod.error) {
        logger('    - ' + mod.error.message);
      }
      if (mod.error && mod.testOutput) {
        logger(util.sanitizeOutput(mod.testOutput, '    - '));
      }
    });
    logger('');
  }
}

function markdown(logger, modules) {
  if (!(modules instanceof Array)) {
    modules = [modules];
  }

  const passed = util.getPassing(modules);
  const flaky = util.getFlakyFails(modules);
  const failed = util.getFails(modules);

  if (failed.length === 0) {
    logger('## 🎉🎉 CITGM Passed 🎉🎉');
    if (flaky.length > 0) {
      logger('## 📛 But with Flaky Failures 📛');
    }
  } else {
    logger('## 🔥⚠️🔥 CITGM FAILED 🔥⚠️🔥');
  }

  printModulesMarkdown(logger, 'Passing', passed);
  printModulesMarkdown(logger, 'Flaky', flaky);
  printModulesMarkdown(logger, 'Failing', failed);
}

module.exports = markdown;
