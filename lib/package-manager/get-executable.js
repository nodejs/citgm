'use strict';

const path = require('path');
const which = require('which');
const npmWhich = require('npm-which')(__dirname);

const windows = process.platform === 'win32';

module.exports = function getExecutable(binaryName, next) {
  if (binaryName === 'yarn') {
    // Use `npm-which` for yarn to get the locally version
    npmWhich(binaryName, next);

    return;
  }

  which(binaryName, (err, packageManagerBin) => {
    if (err) {
      next(err);
      return;
    }

    if (windows) {
      packageManagerBin = path.join(
        path.dirname(packageManagerBin),
        'node_modules',
        'npm',
        'bin',
        'npm-cli.js'
      );
    }

    next(null, packageManagerBin);
  });
};
