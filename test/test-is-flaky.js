'use strict';

var test = require('tap').test;
var rewire = require('rewire');

var isFlaky = rewire('../lib/is-flaky');

var platformCache = isFlaky.__get__('platform');
var versionCache = isFlaky.__get__('version');

var flake = {
  v5: ['darwin', 'hurd', 'x86']
};

var notFlake = {
  v4: ['darwin', 'hurd', 'x86'],
  x86: 'hurd',
  darwin: 'v0.10'
};

var invalid = {
  'v5': [123, false, false]
};

function shim() {
  isFlaky.__set__('version', 'v5.3.1');
  isFlaky.__set__('platform', 'darwin-x64');
}

function revertShim() {
  isFlaky.__set__('version', versionCache);
  isFlaky.__set__('platform', platformCache);
}

function testVersions(t, testFunction) {
  t.ok(testFunction(process.version), 'the current version is what it is matched against');
  shim();
  t.ok(testFunction('v5'), 'the module is flaky on the current platform');
  t.notok(testFunction('v2'), 'the module is not flaky on the current platform');
  revertShim();
}

function testPlatforms(t, testFunction) {
  t.ok(testFunction(process.platform), 'the current platform is what it is matched against');
  shim();
  t.ok(testFunction('darwin'), 'darwin is flaky');
  t.ok(testFunction('x64'), 'x64 is flaky');
  t.ok(testFunction('darwin-x64'), 'darwin-x64 is flaky');
  t.notok(testFunction('darwin-x86'), 'darwin-x86 is stable');
  t.notok(testFunction('hurd-x86'), 'hurd-x86 is stable');
  t.notok(testFunction('hurd-x64'), 'hurd-x64 is stable');
  t.notok(testFunction('hurd'), 'hurd is stable');
  revertShim();
}

function testArrays(t, testFunction) {
  shim();
  t.ok(testFunction([
    flake,
    flake,
    notFlake,
    invalid
  ]), 'flaky array of object');
  t.notok(testFunction([
    notFlake,
    notFlake,
    notFlake,
    invalid
  ]), 'not flaky array of objects');
  
  t.ok(testFunction([
    'hurd',
    'x86',
    'v4',
    'darwin'
  ]), 'flakey array of string');
  
  t.notok(testFunction([
    'hurd',
    'x86',
    'v4'
  ]), 'not flakey array of string');
  
  t.notok(testFunction([
    true,
    false,
    123
  ]), 'not flaky invalid input');
  
  revertShim();
}

function testObjects(t, testFunction) {
  shim();
  t.ok(testFunction(flake), 'it should be flake');
  t.notok(testFunction(notFlake), 'it should not be flake');
  t.notok(testFunction(invalid), 'invalid input should not give a false positive');
  t.notok(testFunction({
    a: 123,
    v5: false
  }), 'another invalid input that should not give a false positive');
  revertShim();
}

test('isStringFlaky', function (t) {
  var isStringFlaky = isFlaky.__get__('isStringFlaky');
  testVersions(t, isStringFlaky);
  testPlatforms(t, isStringFlaky);
  t.end();
});

test('isObjectFlaky', function (t) {
  var isObjectFlaky = isFlaky.__get__('isObjectFlaky');
  testObjects(t, isObjectFlaky);
  t.end();
});

test('isArrayFlaky', function (t) {
  var isArrayFlaky = isFlaky.__get__('isArrayFlaky');
  testArrays(t, isArrayFlaky);
  t.end();
});

test('isFlaky', function (t) {
  testVersions(t, isFlaky);
  testPlatforms(t, isFlaky);
  testArrays(t, isFlaky);
  testObjects(t, isFlaky);
  t.ok(isFlaky(true), 'true is flaky');
  t.notok(isFlaky(false), 'false is not flaky');
  t.notok(isFlaky(123), 'invalid input is not flaky');
  t.end();
});
