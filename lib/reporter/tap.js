'use strict';
const fs = require('fs');

const _ = require('lodash');

const util = require('./util');

function generateTest(mod, count) {
  const result = (!mod.error || mod.flaky) ? 'ok' : 'not ok';
  const directive = (mod.flaky && mod.error) ? ' # SKIP' : '';
  if (mod.error && mod.error.message) {
    mod.error = mod.error.message;
  }
  const error = mod.error ? [directive, mod.error].join(' ') : '';
  const duration = '\n  duration_ms: ' + mod.duration;
  const output = mod.testOutput ? '\n' + util.sanitizeOutput(mod.testOutput,
        '  #') : '';
  return [result, count + 1, '-', mod.name, 'v' + mod.version + error +
      '\n  ---' + output + duration + '\n  ...'].join(' ');
}

function generateTap(modules) {
  const modulesTap = _.map(modules, generateTest).join('\n');
  return 'TAP version 13\n' + modulesTap + '\n1..' + modules.length;
}

function tap(logger, modules, append) {
  if (!(modules instanceof Array)) {
    modules = [modules];
  }
  const payload = generateTap(modules);
  if (typeof logger === 'string') {
    if (append){
      fs.appendFileSync(logger, payload + '\n');
    } else {
      fs.writeFileSync(logger, payload + '\n');
    }
  } else {
    logger(payload);
  }
}

module.exports = tap;
