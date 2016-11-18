'use strict';
var fs = require('fs');

var _ = require('lodash');

var util = require('./util');

function generateTest(mod, count) {
  var result = (!mod.error || mod.flaky) ? 'ok' : 'not ok';
  var directive = (mod.flaky && mod.error) ? ' # SKIP' : '';
  if (mod.error && mod.error.message) {
    mod.error = mod.error.message;
  }
  var error = mod.error ? [directive, mod.error].join(' ') : '';
  var output = mod.testOutput ? '\n' + util.sanitizeOutput(mod.testOutput, '# ') : '';
  if (mod.test) {
    return [result, count + 1, '-', mod.name, 'test', mod.test, 'v' + mod.version + error + output].join(' ');
  } else {
    return [result, count + 1, '-', mod.name, 'v' + mod.version + error + output].join(' ');
  }
}

function generateTap(modules) {
  var modulesTap = _.map(modules, generateTest).join('\n');
  return 'TAP version 13\n' + modulesTap + '\n1..' + modules.length;
}

function tap(logger, modules, append) {
  if (!(modules instanceof Array)) {
    modules = [modules];
  }
  var payload = generateTap(modules);
  if (typeof logger === 'string') {
    if (append){
      fs.appendFileSync(logger, payload + '\n');
    }
    else {
      fs.writeFileSync(logger, payload + '\n');
    }
  }
  else {
    logger(payload);
  }
}

module.exports = tap;
