'use strict';
const install = require('./install');
const test = require('./test');

module.exports = {
  install: install.bind(null, 'npm'),
  test: test.bind(null, 'npm')
};
