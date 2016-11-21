'use strict';

var fs = require('fs');

var _ = require('lodash');
var builder = require('xmlbuilder');

var util = require('./util');

function generateTest(xml, mod) {
  var output =util.sanitizeOutput(mod.testOutput, '', true);
  var item = xml.ele('testcase');
  item.att('name', [mod.name, 'v' + mod.version].join('-'));
  if (mod.test) {
    item.att('test', mod.test);
  }
  item.ele('system-out').dat(output);
  if (mod.skip || (mod.flaky && mod.error)) {
    item.ele('skipped');
  }
  if (mod.error) {
    item.ele('failure', {'message': 'module test suite failed'}, [mod.error, mod.testError].join(' '));
  }
  return xml;
}

function generateJunit(modules) {
  var xml = builder.create('testsuite', {headless: false});
  xml.att('name', 'citgm');
  _.reduce(modules, generateTest, xml);
  xml.end({ pretty: true });
  return xml;
}

function junit(logger, modules, append) {
  if (!(modules instanceof Array)) {
    modules = [modules];
  }
  var payload = generateJunit(modules);
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

module.exports = junit;
