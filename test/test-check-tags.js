import tap from 'tap';

import { logger } from '../lib/out.js';
import { checkTags } from '../lib/check-tags.js';

const { test } = tap;
const log = logger({ silent: true });

test('test includeTags and matching tag multiple', (t) => {
  t.plan(1);
  const options = {
    includeTags: ['a'],
    excludeTags: []
  };
  const mod = {
    tags: ['a', 'b']
  };
  const result = checkTags(options, mod, 'test', log);
  t.notOk(result, 'should return false');
});

test('test includeTags and matching tag', (t) => {
  t.plan(1);
  const options = {
    includeTags: ['a'],
    excludeTags: []
  };
  const mod = {
    tags: 'a'
  };
  const result = checkTags(options, mod, 'test', log);
  t.notOk(result, 'should return false');
});

test('test includeTags and no matching tag', (t) => {
  t.plan(1);
  const options = {
    includeTags: ['a'],
    excludeTags: []
  };
  const mod = {
    tags: 'b'
  };
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
});

test('test includeTags and no tag', (t) => {
  t.plan(1);
  const options = {
    includeTags: ['a'],
    excludeTags: []
  };
  const mod = {
    tags: []
  };
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
});

test('test excludeTags and matching tag multiple', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['a'],
    includeTags: []
  };
  const mod = {
    tags: ['a', 'b']
  };
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
});

test('test excludeTags and matching tag', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['a'],
    includeTags: []
  };
  const mod = {
    tags: 'a'
  };
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
});

test('test excludeTags and no matching tag', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['a'],
    includeTags: []
  };
  const mod = {
    tags: 'b'
  };
  const result = checkTags(options, mod, 'test', log);
  t.notOk(result, 'should return false');
});

test('test excludeTags and no tag', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['a'],
    includeTags: []
  };
  const mod = {
    tags: []
  };
  const result = checkTags(options, mod, 'test', log);
  t.notOk(result, 'should return false');
});

test('test includeTags and matching tag multiple', (t) => {
  t.plan(1);
  const options = {
    includeTags: ['b'],
    excludeTags: []
  };
  const mod = {
    tags: ['a', 'b']
  };
  const result = checkTags(options, mod, 'test', log);
  t.notOk(result, 'should return false');
});

test('test includeTags and no matching tag', (t) => {
  t.plan(1);
  const options = {
    includeTags: ['b'],
    excludeTags: []
  };
  const mod = {
    tags: 'a'
  };
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
});

test('test includeTags and matching tag', (t) => {
  t.plan(1);
  const options = {
    includeTags: ['b'],
    excludeTags: []
  };
  const mod = {
    tags: 'b'
  };
  const result = checkTags(options, mod, 'test', log);
  t.notOk(result, 'should return false');
});

test('test includeTags and no tag', (t) => {
  t.plan(1);
  const options = {
    includeTags: ['b'],
    excludeTags: []
  };
  const mod = {
    tags: []
  };
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
});

test('test excludeTags and matching tag multiple', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['b'],
    includeTags: []
  };
  const mod = {
    tags: ['a', 'b']
  };
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
});

test('test excludeTags and no matching tag', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['b'],
    includeTags: []
  };
  const mod = {
    tags: 'a'
  };
  const result = checkTags(options, mod, 'test', log);
  t.notOk(result, 'should return false');
});

test('test excludeTags and matching tag', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['b'],
    includeTags: []
  };
  const mod = {
    tags: 'b'
  };
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
});

test('test excludeTags and no tag', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['b'],
    includeTags: []
  };
  const mod = {
    tags: []
  };
  const result = checkTags(options, mod, 'test', log);
  t.notOk(result, 'should return false');
});

test('test excludeTags, includeTags and matching tag', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['a'],
    includeTags: ['b']
  };
  const mod = {
    tags: ['a', 'b']
  };
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
});

test('test excludeTags,includeTags and matching includeTags tag', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['b'],
    includeTags: ['a']
  };
  const mod = {
    tags: 'a'
  };
  const result = checkTags(options, mod, 'test', log);
  t.notOk(result, 'should return false');
});

test('test excludeTags,includeTags and matching excludeTags tag', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['b'],
    includeTags: ['a']
  };
  const mod = {
    tags: 'b'
  };
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
});

test('test excludeTags, includeTags and no matching tags', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['b'],
    includeTags: ['a']
  };
  const mod = {};
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
});

test('test excludeTags, includeTags and matching tag', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['b'],
    includeTags: ['a']
  };
  const mod = {
    tags: ['a', 'b']
  };
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
});

test('test excludeTags,includeTags and matching excludeTags tag', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['a'],
    includeTags: ['b']
  };
  const mod = {
    tags: 'a'
  };
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
});

test('test excludeTags,includeTags and matching includeTags tag', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['a'],
    includeTags: ['b']
  };
  const mod = {
    tags: 'b'
  };
  const result = checkTags(options, mod, 'test', log);
  t.notOk(result, 'should return false');
});

test('test excludeTags, includeTags and no matching tags', (t) => {
  t.plan(1);
  const options = {
    excludeTags: ['a'],
    includeTags: ['b']
  };
  const mod = {
    tags: []
  };
  const result = checkTags(options, mod, 'test', log);
  t.ok(result, 'should return true');
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
