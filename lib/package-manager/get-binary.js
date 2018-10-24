'use strict';

const path = require('path');
const which = require('which').sync;
const npmWhich = require('npm-which')(__dirname).sync;

const windows = (process.platform === 'win32');

module.exports = function(binaryName, options) {
  if (binaryName === 'yarn') {
    // Use `npm-which` for yarn to get the locally version
    return npmWhich(binaryName, {path: options.env.PATH
        || process.env.PATH});
  }

  let packageManagerBin = which(binaryName, {path: options.env.PATH
        || process.env.PATH});
  if (windows) {
    packageManagerBin = path.join(path.dirname(packageManagerBin),
        'node_modules', 'npm', 'bin', 'npm-cli.js');
  }

  return packageManagerBin;
};
