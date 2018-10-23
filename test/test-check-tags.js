'use strict';

const test = require('tap').test;
const rewire = require('rewire');

const checkTags = rewire('../lib/check-tags');
const log = require('../lib/out')({});

test('test includeTags and matching tag multiple', (t) => {
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

test('test includeTags and matching tag', (t) => {
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

test('test includeTags and no matching tag', (t) => {
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

test('test includeTags and no tag', (t) => {
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

test('test excludeTags and matching tag multiple', (t) => {
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

test('test excludeTags and matching tag', (t) => {
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

test('test excludeTags and no matching tag', (t) => {
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

test('test excludeTags and no tag', (t) => {
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

test('test includeTags and matching tag multiple', (t) => {
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

test('test includeTags and no matching tag', (t) => {
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

test('test includeTags and matching tag', (t) => {
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

test('test includeTags and no tag', (t) => {
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

test('test excludeTags and matching tag multiple', (t) => {
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

test('test excludeTags and no matching tag', (t) => {
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

test('test excludeTags and matching tag', (t) => {
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

test('test excludeTags and no tag', (t) => {
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

test('test excludeTags, includeTags and matching tag', (t) => {
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

test('test excludeTags,includeTags and matching includeTags tag', (t) => {
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

test('test excludeTags,includeTags and matching excludeTags tag', (t) => {
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

test('test excludeTags, includeTags and no matching tags', (t) => {
  const options = {
    excludeTags: ['b'],
    includeTags: ['a']
  };
  const mod = {};
  t.plan(1);
  const result = checkTags(options, mod, 'test', log);
  t.true(result, 'should return true');
});

test('test excludeTags, includeTags and matching tag', (t) => {
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

test('test excludeTags,includeTags and matching excludeTags tag', (t) => {
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

test('test excludeTags,includeTags and matching includeTags tag', (t) => {
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

test('test excludeTags, includeTags and no matching tags', (t) => {
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

test('test module name can be used in includeTags/excludeTags', (t) => {
  t.plan(2);

  t.equal(
    checkTags(
      { excludeTags: [], includeTags: ['test'] },
      { tags: 'b' },
      'test',
      log
    ),
    false
  );

  t.equal(
    checkTags(
      { excludeTags: ['test'], includeTags: [] },
      { tags: 'b' },
      'test',
      log
    ),
    true
  );
});

test('test tags matching module name with includeTags/excludeTags', (t) => {
  t.plan(2);

  t.equal(
    checkTags(
      { excludeTags: [], includeTags: ['test'] },
      { tags: 'test' },
      'test',
      log
    ),
    false
  );

  t.equal(
    checkTags(
      { excludeTags: ['test'], includeTags: [] },
      { tags: 'test' },
      'test',
      log
    ),
    true
  );
});
