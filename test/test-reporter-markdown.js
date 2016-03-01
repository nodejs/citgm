'use strict';
var test = require('tap').test;

var markdown = require('../lib/reporter/markdown');
var fixtures = require('./fixtures/reporter-fixtures');

test('single passing module:', function (t) {
  var output = '';
  markdown(function logger(data) {
    output += data;
  }, fixtures.iPass);
  var expected = '## 🎉🎉 CITGM Passed 🎉🎉';
  expected += '### Passing Modules';
  expected += '  * iPass v4.2.2';
  t.equals(output, expected, 'we should have the expected markdown output');
  t.end();
});

test('single failing module:', function (t) {
  var output = '';
  markdown(function logger(data) {
    output += data;
  }, fixtures.iFail);
  var expected = '## 🔥⚠️🔥 CITGM FAILED 🔥⚠️🔥';
  expected += '### Failing Modules';
  expected += '  * iFail v3.0.1';
  expected += '    - I dun wurk';
  expected += '    -  Thanks for testing!';
  t.equals(output, expected, 'we should have the expected markdown output');
  t.end();
});

test('multiple modules passing, with a flaky module that fails:', function (t) {
  var output = '';
  markdown(function logger(data) {
    output += data;
  }, [fixtures.iPass, fixtures.iFlakyPass, fixtures.iFlakyFail]);
  var expected = '## 🎉🎉 CITGM Passed 🎉🎉';
  expected += '## 📛 But with Flaky Failures 📛';
  expected += '### Passing Modules';
  expected += '  * iPass v4.2.2';
  expected += '  * iFlakyPass v3.0.1';
  expected += '### Flaky Modules';
  expected += '  * iFlakyFail v3.3.3';
  expected += '    - I dun wurk';
  expected += '    -  Thanks for testing!';
  t.equals(output, expected, 'we should have the expected markdown output');
  t.end();
});
