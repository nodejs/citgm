'use strict';

const async = require('async');

const install = require('./install');
const test = require('./test');
const getExecutable = require('./get-executable');

function pkgInstall(context, next) {
  if (context.options.yarn || context.module.useYarn) {
    install('yarn', context, next);
  } else {
    install('npm', context, next);
  }
}

function pkgTest(context, next) {
  if (context.options.yarn || context.module.useYarn) {
    test('yarn', context, next);
  } else {
    test('npm', context, next);
  }
}

function getPackageManagers(next) {
  async.parallel([
    getExecutable.bind(null, 'npm'),
    getExecutable.bind(null, 'yarn')
  ], (err, res) => {
    if (err) {
      next(err);
      return;
    }

    next(null, { npm: res[0], yarn: res[1] });
  });
}

module.exports = {
  install: pkgInstall,
  test: pkgTest,
  getPackageManagers: getPackageManagers
};
