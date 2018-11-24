'use strict';

const test = require('tap').test;
const rewire = require('rewire');

const npmTest = rewire('../../lib/package-manager/test');

const authorName = npmTest.__get__('authorName');

test('npm.test() authorName:', function (t) {
  const name = 'titus';
  const author = {
    name: 'Randy Savage',
    email: 'randy@wwe.rekt',
    url: 'omg.html'
  };
  const authorExpected = 'Randy Savage <randy@wwe.rekt> (omg.html)';
  t.equals(authorName(name), name, 'it should return any string');
  t.equals(authorName(author), authorExpected, 'it should return the expected'
    + ' string when given an object');
  t.end();
});

test('npm.test() authorName partial data:', function (t) {
  const name = 'titus';
  const authorOne = {
    name: 'Randy Savage'
  };
  const authorOneExpected = 'Randy Savage';
  const authorTwo = {
    email: 'thedude@abides.net'
  };
  const authorTwoExpected = '<thedude@abides.net>';
  t.equals(authorName(name), name, 'it should return any string');
  t.equals(authorName(authorOne), authorOneExpected, 'it should return the'
    + ' expected string when given an object');
  t.equals(authorName(authorTwo), authorTwoExpected, 'it should return the'
  + ' expected string when given an object');
  t.end();
});
