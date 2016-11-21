'use strict';

var _ = require('lodash');

var util = require('./util');

function printModulesMarkdown(logger, title, modules) {
  if (modules.length > 0) {
    logger('### ' + title + ' Modules');
    _.each(modules, function (mod) {
      if (mod.test) {
        logger('  * ' + mod.name + ' test ' + mod.test + ' v' + mod.version);
      } else {
        logger('  * ' + mod.name + ' v' + mod.version);
      }
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

  var passed = util.getPassing(modules);
  var flaky = util.getFlakyFails(modules);
  var failed = util.getFails(modules);

  if (failed.length === 0) {
    logger('## 🎉🎉 CITGM Passed 🎉🎉');
    if (flaky.length > 0) {
      logger('## 📛 But with Flaky Failures 📛');
    }
  }
  else {
    logger('## 🔥⚠️🔥 CITGM FAILED 🔥⚠️🔥');
  }

  printModulesMarkdown(logger, 'Passing', passed);
  printModulesMarkdown(logger, 'Flaky', flaky);
  printModulesMarkdown(logger, 'Failing', failed);
}

module.exports = markdown;
