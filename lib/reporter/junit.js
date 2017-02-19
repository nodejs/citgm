'use strict';
const fs = require('fs');

const _ = require('lodash');
const builder = require('xmlbuilder');

const util = require('./util');

function generateTest(xml, mod) {
  const output =util.sanitizeOutput(mod.testOutput, '', true);
  const item = xml.ele('testcase');
  item.att('name', [mod.name, 'v' + mod.version].join('-'));
  item.att('time', mod.duration / 1000);
  item.ele('system-out').dat(output);
  if (mod.skip || (mod.flaky && mod.error)) {
    item.ele('skipped');
  }
  if (mod.error) {
    item.ele('failure', {'message': 'module test suite failed'}, [mod.error,
      mod.testError].join(' '));
  }
  return xml;
}

function generateJunit(modules) {
  const xml = builder.create('testsuite', {headless: false});
  xml.att('name', 'citgm');
  _.reduce(modules, generateTest, xml);
  xml.end({ pretty: true });
  return xml;
}

function junit(logger, modules, append) {
  if (!(modules instanceof Array)) {
    modules = [modules];
  }
  const payload = generateJunit(modules);
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

module.exports = junit;
