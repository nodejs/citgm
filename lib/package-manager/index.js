'use strict';
const install = require('./install');
const test = require('./test');

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

module.exports = {
  install: pkgInstall,
  test: pkgTest
};
