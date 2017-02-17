'use strict';

const test = require('tap').test;
const rewire = require('rewire');

const isMatch = rewire('../lib/match-conditions');

const platformCache = isMatch.__get__('platform');
const versionCache = isMatch.__get__('version');
const archCache = isMatch.__get__('arch');
const semVersionCache = isMatch.__get__('semVersion');
const distroCache = isMatch.__get__('distro');
const releaseCache = isMatch.__get__('release');

const match = {
  v5: ['darwin', 'hurd', 'x86']
};

const notMatch = {
  v4: ['darwin', 'hurd', 'x86'],
  x86: 'hurd',
  darwin: 'v0.10'
};

const invalid = {
  'v5': [123, false, false]
};

function shim() {
  isMatch.__set__('version', 'v5.3.1');
  isMatch.__set__('platform', 'darwin');
  isMatch.__set__('arch', 'x64');
  isMatch.__set__('semVersion', 'v5.3.1');
  isMatch.__set__('distro', 'macos');
  isMatch.__set__('release', '10.12.2');
}

function revertShim() {
  isMatch.__set__('version', versionCache);
  isMatch.__set__('platform', platformCache);
  isMatch.__set__('arch', archCache);
  isMatch.__set__('semVersion', semVersionCache);
  isMatch.__set__('distro', distroCache);
  isMatch.__set__('release', releaseCache);
}

function testVersions(t, testFunction) {
  t.ok(testFunction(process.version),
      'the current version is what it is matched against');
  shim();
  t.ok(testFunction('v5'), 'the module is matched on the current platform');
  t.ok(testFunction('> 5.0.0'),
      'the module is matched on the current platform');
  t.ok(testFunction('macos'), 'the distro is correct');
  t.notok(testFunction('v2'),
      'the module is not matched on the current platform');
  t.notok(testFunction('<=v2.0.0'),
      'the module is not matched on the current platform');
  revertShim();
}

function testPlatforms(t, testFunction) {
  t.ok(testFunction(process.platform),
      'the current platform is what it is matched against');
  shim();
  t.ok(testFunction('darwin'), 'darwin is matched');
  t.ok(testFunction('x64'), 'x64 is matched');
  t.ok(testFunction('darwin-x64'), 'darwin-x64 is matched');
  t.notok(testFunction('darwin-x86'), 'darwin-x86 is not matched');
  t.notok(testFunction('hurd-x86'), 'hurd-x86 is not matched');
  t.notok(testFunction('hurd-x64'), 'hurd-x64 is not matched');
  t.notok(testFunction('hurd'), 'hurd is not matched');
  revertShim();
}

function testArrays(t, testFunction) {
  shim();
  t.ok(testFunction([
    match,
    match,
    notMatch,
    invalid
  ]), 'matched array of object');
  t.notok(testFunction([
    notMatch,
    notMatch,
    notMatch,
    invalid
  ]), 'not matched array of objects');

  t.ok(testFunction([
    'hurd',
    'x86',
    'v4',
    'darwin'
  ]), 'matchy array of string');

  t.notok(testFunction([
    'hurd',
    'x86',
    'v4'
  ]), 'not matchy array of string');

  t.notok(testFunction([
    true,
    false,
    123
  ]), 'not matched invalid input');

  revertShim();
}

function testObjects(t, testFunction) {
  shim();
  t.ok(testFunction(match), 'it should be matched');
  t.notok(testFunction(notMatch), 'it should not be matched');
  t.notok(testFunction(invalid),
      'invalid input should not give a false positive');
  t.notok(testFunction({
    a: 123,
    v5: false
  }), 'another invalid input that should not give a false positive');
  revertShim();
}

test('isStringMatch', function (t) {
  var isStringMatch = isMatch.__get__('isStringMatch');
  testVersions(t, isStringMatch);
  testPlatforms(t, isStringMatch);
  t.end();
});

test('isObjectMatch', function (t) {
  var isObjectMatch = isMatch.__get__('isObjectMatch');
  testObjects(t, isObjectMatch);
  t.end();
});

test('isArrayMatch', function (t) {
  var isArrayMatch = isMatch.__get__('isArrayMatch');
  testArrays(t, isArrayMatch);
  t.end();
});

test('isMatch', function (t) {
  testVersions(t, isMatch);
  testPlatforms(t, isMatch);
  testArrays(t, isMatch);
  testObjects(t, isMatch);
  t.ok(isMatch(true), 'true is matched');
  t.notok(isMatch(false), 'false is not matched');
  t.notok(isMatch(123), 'invalid input is not matched');
  t.end();
});
