'use strict';

const npmWhich = require('npm-which')(__dirname);
const which = require('which');

module.exports = function getExecutable(binaryName, next) {
  if (binaryName === 'yarn') {
    // Use `npm-which` for yarn to get the local version
    npmWhich(binaryName, next);
  } else {
    which(binaryName, next);
  }
};
