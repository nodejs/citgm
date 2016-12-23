'use strict';

const BufferList = require('bl');

function npmContext(mod, path, options) {
  if (typeof mod === 'string') {
    mod = {
      name: mod
    };
  }
  if (!options) options = {};
  const context = {
    emit: function() {},
    path: path,
    module: mod,
    testOutput: new BufferList(),
    testError: new BufferList(),
    meta: {},
    options: options
  };
  return context;
}

module.exports = {
  npmContext: npmContext
};
