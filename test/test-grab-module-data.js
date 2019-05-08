'use strict';
// FIXME this is not a real unit test
// FIXME it does not stub npm

const { test } = require('tap');

const grabModuleData = require('../lib/grab-module-data');

test('grab-module-data: lodash', async (t) => {
  t.plan(5);
  const context = {
    path: __dirname,
    module: {
      raw: 'lodash',
      type: null,
      hosted: {
        type: null
      }
    },
    emit: function() {},
    options: {}
  };

  await grabModuleData(context);
  t.ok(context.meta, 'There should be a context.meta');
  t.equals(
    context.meta.name,
    'lodash',
    'The name of the results should be lodash'
  );
  t.ok(context.meta.dist, 'It should have a dist object');
  t.ok(context.meta.dist.shasum, 'The dist should have a shasum');
  t.ok(context.meta.dist.tarball, 'The dist should have a tarball');
});

test('grab-module-data: does not exist', async (t) => {
  t.plan(1);
  const context = {
    path: __dirname,
    module: {
      raw: 'FAIL',
      type: null,
      hosted: {
        type: null
      }
    },
    emit: function() {},
    options: {}
  };

  await grabModuleData(context);
  t.notOk(context.meta, 'There should not be a context.meta');
});

test('grab-module-data: hosted', async (t) => {
  t.plan(1);
  const context = {
    path: __dirname,
    module: {
      raw: 'FAIL',
      type: 'git',
      hosted: {
        type: 'github',
        git: () => 'git://nope@nope:~/nope.git'
      }
    },
    emit: function() {},
    options: {}
  };

  const expected = {
    repository: {
      type: 'git',
      url: context.module.hosted.git()
    }
  };

  await grabModuleData(context);
  t.deepequals(
    context.meta,
    expected,
    'The returned meta object should' +
      ' include a type of git and the supplied url'
  );
});
