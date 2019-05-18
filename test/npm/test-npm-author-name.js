import tap from 'tap';

import { authorName } from '../../lib/package-manager/test.js';

const { test } = tap;

test('npm.test() authorName:', (t) => {
  t.plan(2);
  const name = 'titus';
  const author = {
    name: 'Randy Savage',
    email: 'randy@wwe.rekt',
    url: 'omg.html'
  };
  const authorExpected = 'Randy Savage <randy@wwe.rekt> (omg.html)';
  t.equal(authorName(name), name, 'it should return any string');
  t.equal(
    authorName(author),
    authorExpected,
    'it should return the expected' + ' string when given an object'
  );
  t.end();
});

test('npm.test() authorName partial data:', (t) => {
  t.plan(3);
  const name = 'titus';
  const authorOne = {
    name: 'Randy Savage'
  };
  const authorOneExpected = 'Randy Savage';
  const authorTwo = {
    email: 'thedude@abides.net'
  };
  const authorTwoExpected = '<thedude@abides.net>';
  t.equal(authorName(name), name, 'it should return any string');
  t.equal(
    authorName(authorOne),
    authorOneExpected,
    'it should return the' + ' expected string when given an object'
  );
  t.equal(
    authorName(authorTwo),
    authorTwoExpected,
    'it should return the' + ' expected string when given an object'
  );
  t.end();
});
