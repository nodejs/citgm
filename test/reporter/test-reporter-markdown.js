'use strict';
const test = require('tap').test;

const markdown = require('../../lib/reporter/markdown');
const fixtures = require('../fixtures/reporter-fixtures');

test('single passing module:', function (t) {
  let output = '';
  markdown(function logger(data) {
    output += data;
  }, fixtures.iPass);
  let expected = '## 🎉🎉 CITGM Passed 🎉🎉';
  expected += '### Passing Modules';
  expected += '  * iPass v4.2.2 duration:50ms';
  t.equals(output, expected, 'we should have the expected markdown output');
  t.end();
});

test('single failing module:', function (t) {
  let output = '';
  markdown(function logger(data) {
    output += data;
  }, fixtures.iFail);
  let expected = '## 🔥⚠️🔥 CITGM FAILED 🔥⚠️🔥';
  expected += '### Failing Modules';
  expected += '  * iFail v3.0.1 duration:50ms';
  expected += '    - I dun wurk';
  expected += '    -  Thanks for testing!';
  t.equals(output, expected, 'we should have the expected markdown output');
  t.end();
});

test('multiple modules passing, with a flaky module that fails:', function (t) {
  let output = '';
  markdown(function logger(data) {
    output += data;
  }, [fixtures.iPass, fixtures.iFlakyPass, fixtures.iFlakyFail]);
  let expected = '## 🎉🎉 CITGM Passed 🎉🎉';
  expected += '## 📛 But with Flaky Failures 📛';
  expected += '### Passing Modules';
  expected += '  * iPass v4.2.2 duration:50ms';
  expected += '  * iFlakyPass v3.0.1 duration:50ms';
  expected += '### Flaky Modules';
  expected += '  * iFlakyFail v3.3.3 duration:50ms';
  expected += '    - I dun wurk';
  expected += '    -  Thanks for testing!';
  t.equals(output, expected, 'we should have the expected markdown output');
  t.end();
});
