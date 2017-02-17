'use strict';
const test = require('tap').test;
const rewire = require('rewire');

const update = rewire('../lib/update');

const pkg = update.__get__('pkg');

pkg.version = '0.0.0';

test('update: /w callback', function (t) {
  const log = {
    warn: function (data) {
      t.equals(data, 'update-available');
      t.end();
    }
  };
  update(log);
});
