'use strict';
const install = require('./install');
const test = require('./test');

module.exports = {
  install: install.bind(null, 'yarn'),
  test: test.bind(null, 'yarn')
};
