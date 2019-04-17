'use strict';

const { promisify } = require('util');

const npmWhich = promisify(require('npm-which')(__dirname));
const which = promisify(require('which'));

module.exports = function getExecutable(binaryName) {
  if (binaryName === 'yarn') {
    // Use `npm-which` for yarn to get the local version
    return npmWhich(binaryName);
  } else {
    return which(binaryName);
  }
};
