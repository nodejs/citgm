'use strict';

const test = require('tap').test;
const proxyquire = require('proxyquire');

const update = proxyquire('../lib/update', {
  '../package.json': {
    version: '0.0.0'
  }
});

test('update: /w callback', (t) => {
  const log = {
    warn: function(data) {
      t.equals(data, 'update-available');
      t.end();
    }
  };
  update(log);
});
