'use strict';

const test = require('tap').test;
const rewire = require('rewire');

const npmTest = rewire('../../lib/npm/test');

const authorName = npmTest.__get__('authorName');

test('npm.test() authorName:', function (t) {
  var name = 'titus';
  var author = {
    name: 'Randy Savage',
    email: 'randy@wwe.rekt',
    url: 'omg.html'
  };
  var authorExpected = 'Randy Savage <randy@wwe.rekt> (omg.html)';
  t.equals(authorName(name), name, 'it should return any string');
  t.equals(authorName(author), authorExpected, 'it should return the expected'
    + ' string when given an object');
  t.end();
});

test('npm.test() authorName partial data:', function (t) {
  var name = 'titus';
  var authorOne = {
    name: 'Randy Savage'
  };
  var authorOneExpected = 'Randy Savage';
  var authorTwo = {
    email: 'thedude@abides.net'
  };
  var authorTwoExpected = '<thedude@abides.net>';
  t.equals(authorName(name), name, 'it should return any string');
  t.equals(authorName(authorOne), authorOneExpected, 'it should return the'
    + ' expected string when given an object');
  t.equals(authorName(authorTwo), authorTwoExpected, 'it should return the'
  + ' expected string when given an object');
  t.end();
});
