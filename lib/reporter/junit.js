'use strict';

const fs = require('fs');

const _ = require('lodash');
const builder = require('xmlbuilder');

const util = require('./util');

function generateTest(xml, mod) {
  const output = util.sanitizeOutput(mod.testOutput, '', true);
  const item = xml.ele('testcase');
  let name = mod.name;
  if (mod.version) {
    name = [name, `v${mod.version}`].join('-');
  }
  item.att('name', name);
  item.att('time', mod.duration / 1000);
  item.ele('system-out').dat(output);
  if (mod.skipped || (mod.flaky && mod.error)) {
    item.ele('skipped');
  }
  if (mod.error) {
    item.ele(
      'failure',
      { message: 'module test suite failed' },
      [mod.error, mod.testError].join(' ')
    );
  }
  return xml;
}

function generateJunit(modules) {
  const xml = builder.create('testsuite', { headless: true });
  xml.att('name', 'citgm');
  _.reduce(modules, generateTest, xml);
  return xml.end({ pretty: true });
}

function junit(logger, modules, append) {
  if (!(modules instanceof Array)) {
    modules = [modules];
  }
  const payload = generateJunit(modules);

  if (typeof logger === 'string') {
    if (append) {
      fs.appendFileSync(logger, `${payload}\n`);
    } else {
      fs.writeFileSync(logger, `${payload}\n`);
    }
  } else {
    logger(payload);
  }
}

module.exports = junit;
