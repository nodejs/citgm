'use strict';
// FIXME this is not a real unit test
// FIXME it does not stub npm

const test = require('tap').test;

const grabModuleData = require('../lib/grab-module-data');

test('grab-module-data: lodash', function (t) {
  const context = {
    path: __dirname,
    module: {
      raw: 'lodash',
      type: null,
      hosted: {
        type: null
      }
    },
    emit: function () {},
    options: {}
  };

  grabModuleData(context, function (err, result) {
    t.error(err);
    t.ok(result.meta, 'There should be a result.meta');
    t.equals(result.meta.name, 'lodash',
        'The name of the results should be lodash');
    t.ok(result.meta.dist, 'It should have a dist object');
    t.ok(result.meta.dist.shasum, 'The dist should have a shasum');
    t.ok(result.meta.dist.tarball, 'The dist should have a tarball');
    t.end();
  });
});

test('grab-module-data: does not exist', function (t) {
  const context = {
    path: __dirname,
    module: {
      raw: 'FAIL',
      type: null,
      hosted: {
        type: null
      }
    },
    emit: function () {},
    options: {}
  };

  grabModuleData(context, function (err, result) {
    t.error(err);
    t.notOk(result.meta, 'There should not be a result.meta');
    t.end();
  });
});

test('grab-module-data: hosted', function (t) {
  const context = {
    path: __dirname,
    module: {
      raw: 'FAIL',
      type: 'hosted',
      hosted: {
        type: 'github',
        gitUrl: 'git://nope@nope:~/nope.git'
      }
    },
    emit: function () {},
    options: {}
  };

  const expected = {
    repository: {
      type: 'git',
      url: context.module.hosted.gitUrl
    }
  };

  grabModuleData(context, function (err, result) {
    t.error(err);
    t.deepequals(result.meta, expected, 'The returned meta object should'
    + ' include a type of git and the supplied url');
    t.end();
  });
});
