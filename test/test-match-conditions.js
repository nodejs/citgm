import tap from 'tap';

import { defaultMatcher, ConditionMatcher } from '../lib/match-conditions.js';

const { test } = tap;

const match = {
  v5: ['darwin', 'hurd', 'x86']
};

const notMatch = {
  v4: ['darwin', 'hurd', 'x86'],
  x86: 'hurd',
  darwin: 'v0.10'
};

const invalid = {
  v5: [123, false, false]
};

test('default should match current process', (t) => {
  t.ok(defaultMatcher.isMatch(process.version));
  t.ok(defaultMatcher.isStringMatch(process.version));

  t.ok(defaultMatcher.isMatch(process.platform));
  t.ok(defaultMatcher.isStringMatch(process.platform));

  t.end();
});

const testMatcher = new ConditionMatcher({
  version: 'v5.3.1',
  platform: 'darwin',
  arch: 'x64',
  distro: 'macos',
  release: '10.12.2',
  endian: '',
  fips: ''
});

function testVersions(t, testFunction) {
  t.ok(testFunction('v5'), 'the module is matched on the current platform');
  t.ok(
    testFunction('> 5.0.0'),
    'the module is matched on the current platform'
  );
  t.ok(testFunction('macos'), 'the distro is correct');
  t.notOk(
    testFunction('v2'),
    'the module is not matched on the current platform'
  );
  t.notOk(
    testFunction('<=v2.0.0'),
    'the module is not matched on the current platform'
  );
}

function testPlatforms(t, testFunction) {
  t.ok(testFunction('darwin'), 'darwin is matched');
  t.ok(testFunction('x64'), 'x64 is matched');
  t.ok(testFunction('darwin-x64'), 'darwin-x64 is matched');
  t.notOk(testFunction('darwin-x86'), 'darwin-x86 is not matched');
  t.notOk(testFunction('hurd-x86'), 'hurd-x86 is not matched');
  t.notOk(testFunction('hurd-x64'), 'hurd-x64 is not matched');
  t.notOk(testFunction('hurd'), 'hurd is not matched');
}

function testArrays(t, testFunction) {
  t.ok(
    testFunction([match, match, notMatch, invalid]),
    'matched array of object'
  );
  t.notOk(
    testFunction([notMatch, notMatch, notMatch, invalid]),
    'not matched array of objects'
  );

  t.ok(testFunction(['hurd', 'x86', 'v4', 'darwin']), 'matchy array of string');

  t.notOk(testFunction(['hurd', 'x86', 'v4']), 'not matchy array of string');

  t.ok(testFunction([true, false, 123]), 'True evaluates to true');

  t.notOk(testFunction([false, 123]), 'No truthy results evaluate to false');
}

function testObjects(t, testFunction) {
  t.ok(testFunction(match), 'it should be matched');
  t.notOk(testFunction(notMatch), 'it should not be matched');
  t.notOk(
    testFunction(invalid),
    'invalid input should not give a false positive'
  );
  t.notOk(
    testFunction({
      a: 123,
      v5: false
    }),
    'another invalid input that should not give a false positive'
  );
}

test('isStringMatch', (t) => {
  const isStringMatch = testMatcher.isStringMatch.bind(testMatcher);
  testVersions(t, isStringMatch);
  testPlatforms(t, isStringMatch);
  t.end();
});

test('isObjectMatch', (t) => {
  const isObjectMatch = testMatcher.isObjectMatch.bind(testMatcher);
  testObjects(t, isObjectMatch);
  t.end();
});

test('isArrayMatch', (t) => {
  const isArrayMatch = testMatcher.isArrayMatch.bind(testMatcher);
  testArrays(t, isArrayMatch);
  t.end();
});

test('isMatch', (t) => {
  const isMatch = testMatcher.isMatch.bind(testMatcher);
  testVersions(t, isMatch);
  testPlatforms(t, isMatch);
  testArrays(t, isMatch);
  testObjects(t, isMatch);
  t.ok(isMatch(true), 'true is matched');
  t.notOk(isMatch(false), 'false is not matched');
  t.notOk(isMatch(123), 'invalid input is not matched');
  t.end();
});
