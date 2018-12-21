'use strict';

const fs = require('fs');

const test = require('tap').test;
const rewire = require('rewire');
const rimraf = require('rimraf');

const tempDirectory = rewire('../lib/temp-directory');

const isWin32 = process.platform === 'win32';
const skipIfWin32 = isWin32 ? { skip: 'cannot run on Windows' } : {};
const nullDevice = isWin32 ? '\\\\.\\NUL' : '/dev/null';

const context = {
  path: null,
  emit: function() {},
  module: {
    name: 'test-module'
  }
};

const contextTmpDir = {
  options: {
    tmpDir: '.thisisatest'
  },
  path: null,
  emit: function() {},
  module: {
    name: 'test-module'
  }
};

test('tempDirectory.create:', (t) => {
  t.notOk(context.path, 'context should not have a path');
  tempDirectory.create(context, (e, ctx) => {
    t.error(e);
    t.ok(ctx.path, 'context should now have a path');
    fs.stat(ctx.path, (err, stats) => {
      t.error(err);
      t.ok(stats.isDirectory(), 'the path should exist and be a folder');
      t.end();
    });
  });
});

test('tempDirectory.create --tmpDir:', (t) => {
  tempDirectory.create(contextTmpDir, (e, ctx) => {
    t.error(e);
    t.ok(
      ctx.path.match(/thisisatest[/\\].*-.*-.*-.*-.*/),
      'the path should match --tmpDir'
    );
    fs.stat(ctx.path, (err, stats) => {
      t.error(err);
      t.ok(stats.isDirectory(), 'the path should exist and be a folder');
      rimraf('./.thisisatest', () => {});
      t.end();
    });
  });
});

// Skip because Windows allows mkdir calls on the null device.
test('tempDirectory.create: bad path', skipIfWin32, (t) => {
  t.plan(2);

  const badContext = {
    path: null,
    emit: function() {},
    module: {
      name: 'test-module-bad'
    }
  };

  const path = tempDirectory.__get__('path');
  tempDirectory.__set__('path', {
    join: function() {
      return nullDevice;
    }
  });
  tempDirectory.create(badContext, (e) => {
    t.ok(
      e.message.includes(nullDevice),
      `the message should include the path ${nullDevice}`
    );
    t.ok(badContext.path, 'badContext should have a path');
    tempDirectory.__set__('path', path);
    t.end();
  });
});

test('tempDirectory.remove:', (t) => {
  t.ok(context.path, 'context should have a path');
  tempDirectory.remove(context, (e, ctx) => {
    t.error(e);
    fs.stat(ctx.path, (err, stats) => {
      t.ok(err, 'we should get an error as the path does not exist');
      t.notOk(stats, 'stats should be falsey');
      t.end();
    });
  });
});

test('tempDirectory.remove: bad path', (t) => {
  t.plan(1);

  const badContext = {
    path: nullDevice,
    emit: function() {},
    module: {
      name: 'test-module-bad'
    }
  };

  tempDirectory.remove(badContext, (e) => {
    t.ok(
      e.message.includes(nullDevice),
      `the message should include the path ${nullDevice}`
    );
    t.end();
  });
});
