import { readFileSync } from 'fs';

import tap from 'tap';

import markdown from '../../lib/reporter/markdown.js';

const { test } = tap;

const fixtures = JSON.parse(
  readFileSync(new URL('../fixtures/reporter-fixtures.json', import.meta.url))
);

test('single passing module:', (t) => {
  t.plan(1);
  let output = '';
  markdown((data) => {
    output += data;
  }, fixtures.iPass);
  let expected = '## 🎉🎉 CITGM Passed 🎉🎉';
  expected += '### Passing Modules';
  expected += '  * iPass v4.2.2 duration:50ms';
  t.equal(output, expected, 'we should have the expected markdown output');
  t.end();
});

test('single failing module:', (t) => {
  t.plan(1);
  let output = '';
  markdown((data) => {
    output += data;
  }, fixtures.iFail);
  let expected = '## 🔥⚠️🔥 CITGM FAILED 🔥⚠️🔥';
  expected += '### Failing Modules';
  expected += '  * iFail v3.0.1 duration:50ms';
  expected += '    - I dun wurk';
  expected += '    -  Thanks for testing!';
  t.equal(output, expected, 'we should have the expected markdown output');
  t.end();
});

test('multiple modules passing, with a flaky module that fails:', (t) => {
  t.plan(1);
  let output = '';
  markdown(
    (data) => {
      output += data;
    },
    [fixtures.iPass, fixtures.iFlakyPass, fixtures.iFlakyFail]
  );
  let expected = '## 🎉🎉 CITGM Passed 🎉🎉';
  expected += '## 📛 But with Flaky Failures 📛';
  expected += '### Passing Modules';
  expected += '  * iPass v4.2.2 duration:50ms';
  expected += '  * iFlakyPass v3.0.1 duration:50ms';
  expected += '### Flaky Modules';
  expected += '  * iFlakyFail v3.3.3 duration:50ms';
  expected += '    - I dun wurk';
  expected += '    -  Thanks for testing!';
  t.equal(output, expected, 'we should have the expected markdown output');
  t.end();
});
