import { promises as fs } from 'fs';

import tap from 'tap';

import * as tempDirectory from '../lib/temp-directory.js';

const { test } = tap;

const isWin32 = process.platform === 'win32';
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
  const stats = await fs.stat(context.path);
  t.ok(stats.isDirectory(), 'the path should exist and be a folder');
});

test('tempDirectory.create --tmpDir:', async (t) => {
  t.plan(2);
  await tempDirectory.create(contextTmpDir);
  t.ok(
    contextTmpDir.path.match(/thisisatest[/\\].*-.*-.*-.*-.*/),
    'the path should match --tmpDir'
  );
  const stats = await fs.stat(contextTmpDir.path);
  t.ok(stats.isDirectory(), 'the path should exist and be a folder');
  await fs.rm('./.thisisatest', {
    recursive: true,
    force: true,
    maxRetries: 10
  });
});

test('tempDirectory.remove:', async (t) => {
  t.plan(2);
  t.ok(context.path, 'context should have a path');
  await tempDirectory.remove(context);
  await t.rejects(
    fs.stat(context.path),
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
