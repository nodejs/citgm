import { appendFileSync, writeFileSync } from 'fs';

import _ from 'lodash';
import builder from 'xmlbuilder';

import { sanitizeOutput } from './util.js';

function generateTest(xml, mod) {
  const output = sanitizeOutput(mod.testOutput, '', true);
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

export default function junit(logger, modules, append) {
  if (!(modules instanceof Array)) {
    modules = [modules];
  }
  const payload = generateJunit(modules);

  if (typeof logger === 'string') {
    if (append) {
      appendFileSync(logger, `${payload}\n`);
    } else {
      writeFileSync(logger, `${payload}\n`);
    }
  } else {
    logger(payload);
  }
}
