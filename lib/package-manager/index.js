'use strict';
const npm = require('./npm');
const yarn = require('./yarn');

function install(context, next) {
  if (context.options.yarn || context.module.useYarn) {
    yarn.install(context, next);
  } else {
    npm.install(context, next);
  }
}

function test(context, next) {
  if (context.options.yarn || context.module.useYarn) {
    yarn.test(context, next);
  } else {
    npm.test(context, next);
  }
}

module.exports = {
  install: install,
  test: test
};
