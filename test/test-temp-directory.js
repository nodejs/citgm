'use strict';

const { promisify } = require('util');

const { stat } = require('fs-extra');
const { test } = require('tap');
const rewire = require('rewire');
const rimraf = promisify(require('rimraf'));

const tempDirectory = rewire('../lib/temp-directory');

const isWin32 = process.platform === 'win32';
const skipIfWin32 = isWin32 ? { skip: 'cannot run on Windows' } : {};
const nullDevice = isWin32 ? '\\\\.\\NUL' : '/dev/null';

const context = {
  path: null,
  emit: function () {},
  module: {
    name: 'test-module'
  }
};

const contextTmpDir = {
  options: {
    tmpDir: '.thisisatest'
  },
  path: null,
  emit: function () {},
  module: {
    name: 'test-module'
  }
};

test('tempDirectory.create:', async (t) => {
  t.plan(3);
  t.notOk(context.path, 'context should not have a path');
  await tempDirectory.create(context);
  t.ok(context.path, 'context should now have a path');
  const stats = await stat(context.path);
  t.ok(stats.isDirectory(), 'the path should exist and be a folder');
});

test('tempDirectory.create --tmpDir:', async (t) => {
  t.plan(2);
  await tempDirectory.create(contextTmpDir);
  t.ok(
    contextTmpDir.path.match(/thisisatest[/\\].*-.*-.*-.*-.*/),
    'the path should match --tmpDir'
  );
  const stats = await stat(contextTmpDir.path);
  t.ok(stats.isDirectory(), 'the path should exist and be a folder');
  await rimraf('./.thisisatest');
});

// Skip because Windows allows mkdir calls on the null device.
test('tempDirectory.create: bad path', skipIfWin32, async (t) => {
  t.plan(2);

  const badContext = {
    path: null,
    emit: function () {},
    module: {
      name: 'test-module-bad'
    }
  };

  const path = tempDirectory.__get__('path');
  tempDirectory.__set__('path', {
    join: function () {
      return nullDevice;
    }
  });
  try {
    await tempDirectory.create(badContext);
  } catch (e) {
    t.ok(e.message.includes('EEXIST'), `the message should include EEXIST`);
    t.ok(badContext.path, 'badContext should have a path');
    tempDirectory.__set__('path', path);
  }
});

test('tempDirectory.remove:', async (t) => {
  t.plan(2);
  t.ok(context.path, 'context should have a path');
  await tempDirectory.remove(context);
  await t.rejects(
    stat(context.path),
    'we should get an error as the path does not exist'
  );
});

test('tempDirectory.remove: bad path', async (t) => {
  t.plan(1);

  const badContext = {
    path: nullDevice,
    emit: function () {},
    module: {
      name: 'test-module-bad'
    }
  };

  try {
    await tempDirectory.remove(badContext);
  } catch (e) {
    t.ok(
      e.message.includes(nullDevice),
      `the message should include the path ${nullDevice}`
    );
  }
});
