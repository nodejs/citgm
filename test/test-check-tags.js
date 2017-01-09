'use strict';

const test = require('tap').test;
const rewire = require('rewire');

const checkTags = rewire('../lib/check-tags');
const log = require('../lib/out')({});

test('test includeTags and matching tag multiple', function (t) {
  const options = {
    includeTags: ['a'],
    excludeTags: []
  };
  const mod = {
    tags: ['a', 'b']
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.false(result, 'should return false');
});

test('test includeTags and matching tag', function (t) {
  const options = {
    includeTags: ['a'],
    excludeTags: []
  };
  const mod = {
    tags: 'a'
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.false(result, 'should return false');
});

test('test includeTags and no matching tag', function (t) {
  const options = {
    includeTags: ['a'],
    excludeTags: []
  };
  const mod = {
    tags: 'b'
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test includeTags and no tag', function (t) {
  const options = {
    includeTags: ['a'],
    excludeTags: []
  };
  const mod = {
    tags: []
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test excludeTags and matching tag multiple', function (t) {
  const options = {
    excludeTags: ['a'],
    includeTags: []
  };
  const mod = {
    tags: ['a', 'b']
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test excludeTags and matching tag', function (t) {
  const options = {
    excludeTags: ['a'],
    includeTags: []
  };
  const mod = {
    tags: 'a'
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test excludeTags and no matching tag', function (t) {
  const options = {
    excludeTags: ['a'],
    includeTags: []
  };
  const mod = {
    tags: 'b'
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.false(result, 'should return false');
});

test('test excludeTags and no tag', function (t) {
  const options = {
    excludeTags: ['a'],
    includeTags: []
  };
  const mod = {
    tags: []
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.false(result, 'should return false');
});

test('test includeTags and matching tag multiple', function (t) {
  const options = {
    includeTags: ['b'],
    excludeTags: []
  };
  const mod = {
    tags: ['a', 'b']
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.false(result, 'should return false');
});

test('test includeTags and no matching tag', function (t) {
  const options = {
    includeTags: ['b'],
    excludeTags: []
  };
  const mod = {
    tags: 'a'
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test includeTags and matching tag', function (t) {
  const options = {
    includeTags: ['b'],
    excludeTags: []
  };
  const mod = {
    tags: 'b'
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.false(result, 'should return false');
});

test('test includeTags and no tag', function (t) {
  const options = {
    includeTags: ['b'],
    excludeTags: []
  };
  const mod = {
    tags: []
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test excludeTags and matching tag multiple', function (t) {
  const options = {
    excludeTags: ['b'],
    includeTags: []
  };
  const mod = {
    tags: ['a', 'b']
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test excludeTags and no matching tag', function (t) {
  const options = {
    excludeTags: ['b'],
    includeTags: []
  };
  const mod = {
    tags: 'a'
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.false(result, 'should return false');
});

test('test excludeTags and matching tag', function (t) {
  const options = {
    excludeTags: ['b'],
    includeTags: []
  };
  const mod = {
    tags: 'b'
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test excludeTags and no tag', function (t) {
  const options = {
    excludeTags: ['b'],
    includeTags: []
  };
  const mod = {
    tags: []
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.false(result, 'should return false');
});

test('test excludeTags, includeTags and matching tag', function (t) {
  const options = {
    excludeTags: ['a'],
    includeTags: ['b']
  };
  const mod = {
    tags: ['a', 'b']
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test excludeTags,includeTags and matching includeTags tag', function (t) {
  const options = {
    excludeTags: ['b'],
    includeTags: ['a']
  };
  const mod = {
    tags: 'a'
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.false(result, 'should return false');
});

test('test excludeTags,includeTags and matching excludeTags tag', function (t) {
  const options = {
    excludeTags: ['b'],
    includeTags: ['a']
  };
  const mod = {
    tags: 'b'
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test excludeTags, includeTags and no matching tags', function (t) {
  const options = {
    excludeTags: ['b'],
    includeTags: ['a']
  };
  const mod = {
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test excludeTags, includeTags and matching tag', function (t) {
  const options = {
    excludeTags: ['b'],
    includeTags: ['a']
  };
  const mod = {
    tags: ['a', 'b']
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test excludeTags,includeTags and matching excludeTags tag', function (t) {
  const options = {
    excludeTags: ['a'],
    includeTags: ['b']
  };
  const mod = {
    tags: 'a'
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test excludeTags,includeTags and matching includeTags tag', function (t) {
  const options = {
    excludeTags: ['a'],
    includeTags: ['b']
  };
  const mod = {
    tags: 'b'
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.false(result, 'should return false');
});

test('test excludeTags, includeTags and no matching tags', function (t) {
  const options = {
    excludeTags: ['a'],
    includeTags: ['b']
  };
  const mod = {
    tags: []
  };
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});
