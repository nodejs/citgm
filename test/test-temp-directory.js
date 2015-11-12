'use strict';

var fs = require('fs');

var test = require('tap').test;

var tempDirectory = require('../lib/temp-directory');

var context = {
  path: null,
  emit: function () {}
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
