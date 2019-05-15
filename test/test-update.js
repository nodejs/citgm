'use strict';

const { test } = require('tap');
const proxyquire = require('proxyquire');

const update = proxyquire('../lib/update', {
  '../package.json': {
    version: '0.0.0'
  }
});

test('update: /w callback', (t) => {
  t.plan(1);
  const log = {
    warn: function(data) {
      t.equals(data, 'update-available');
      t.end();
    }
  };
  update(log);
});
