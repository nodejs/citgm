'use strict';

const path = require('path');

const { stat } = require('fs-extra');
const { test } = require('tap');

const tempDirectory = require('../lib/temp-directory');
const unpack = require('../lib/unpack');

test('unpack: context.unpack = null', async (t) => {
  t.plan(1);
  const context = {
    unpack: null,
    emit: function () {}
  };

  try {
    await unpack(context);
  } catch (err) {
    t.deepEquals(
      err,
      new Error('Nothing to unpack... Ending'),
      'it should error out'
    );
  }
});

test('unpack: context.unpack is invalid path', async (t) => {
  t.plan(1);
  const context = {
    unpack: path.join(__dirname, '..', 'fixtures', 'do-not-exist.tar.gz'),
    emit: function () {}
  };

  try {
    await unpack(context);
  } catch (err) {
    t.deepEquals(
      err,
      new Error('Nothing to unpack... Ending'),
      'it should error out'
    );
  }
});

test('unpack: valid unpack', async (t) => {
  t.plan(1);
  const context = {
    module: {
      name: 'omg-i-pass'
    },
    unpack: './test/fixtures/omg-i-pass.tgz',
    emit: function () {}
  };

  // FIXME I am not super convinced that the correct tar ball is being deflated
  // FIXME There is a possibility that the npm cache is trumping this

  await tempDirectory.create(context);

  await unpack(context);
  const stats = await stat(path.join(context.path, 'omg-i-pass'));
  t.ok(stats.isDirectory(), 'the untarred result should be a directory');
  await tempDirectory.remove(context);
});

test('unpack: context.unpack = false', async () => {
  const context = {
    unpack: false,
    emit: function () {}
  };

  await unpack(context);
});
