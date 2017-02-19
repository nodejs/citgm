'use strict';

const fs = require('fs');

const test = require('tap').test;
const rewire = require('rewire');

const tempDirectory = rewire('../lib/temp-directory');

const context = {
  path: null,
  emit: function () {},
  module: {
    name: 'test-module'
  }
};

const contextTmpDir = {
  options: {
    tmpDir: 'thisisatest'
  },
  path: null,
  emit: function () {},
  module: {
    name: 'test-module'
  }
};

const badContext = {
  path: null,
  emit: function () {},
  module: {
    name: 'test-module-bad'
  }
};

test('tempDirectory.create:', function (t) {
  t.notOk(context.path, 'context should not have a path');
  tempDirectory.create(context, function (e, ctx) {
    t.error(e);
    t.ok(ctx.path, 'context should now have a path');
    fs.stat(ctx.path, function (err, stats) {
      t.error(err);
      t.ok(stats.isDirectory(), 'the path should exist and be a folder');
      t.end();
    });
  });
});

test('tempDirectory.create --tmpDir:', function (t) {
  tempDirectory.create(contextTmpDir, function (e, ctx) {
    t.error(e);
    t.ok(ctx.path.match(/thisisatest\/.*-.*-.*-.*-.*/),
        'the path should match --tmpDir');
    fs.stat(ctx.path, function (err, stats) {
      t.error(err);
      t.ok(stats.isDirectory(), 'the path should exist and be a folder');
      t.end();
    });
  });
});

test('tempDirectory.create: bad path', function (t) {
  const path = tempDirectory.__get__('path');
  tempDirectory.__set__('path', {
    join: function () {
      return '/dev/null';
    }
  });
  t.notOk(badContext.path, 'badContext should not have a path');
  tempDirectory.create(badContext, function (e) {
    t.notEquals(e.message.search(/\/dev\/null/), -1,
        'the message should include the path /dev/null');
    tempDirectory.__set__('path', path);
    t.end();
  });
});

test('tempDirectory.remove:', function (t) {
  t.ok(context.path, 'context should have a path');
  tempDirectory.remove(context, function (e, ctx) {
    t.error(e);
    fs.stat(ctx.path, function (err, stats) {
      t.ok(err, 'we should get an error as the path does not exist');
      t.notOk(stats, 'stats should be falsey');
      t.end();
    });
  });
});

test('tempDirectory.remove: bad path', function (t) {
  t.ok(badContext, 'badContext should have a path');
  tempDirectory.remove(badContext, function (e) {
    t.notEquals(e.message.search(/\/dev\/null/), -1,
        'the message should include the path /dev/null');
    t.end();
  });
});
