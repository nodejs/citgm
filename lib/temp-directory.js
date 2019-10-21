'use strict';

const { promisify } = require('util');
let path = require('path'); // Mocked in tests

const mkdirp = promisify(require('mkdirp'));
const osenv = require('osenv');
const rimraf = promisify(require('rimraf'));
const uuid = require('uuid');

async function create(context) {
  if (context.options && context.options.tmpDir) {
    context.path = path.join(context.options.tmpDir, uuid.v4());
  } else {
    context.path = path.join(osenv.tmpdir(), uuid.v4());
  }
  context.emit(
    'data',
    'verbose',
    `${context.module.name} mk.tempdir`,
    context.path
  );

  context.homeDir = path.join(context.path, 'home');
  context.npmConfigTmp = path.join(context.path, 'npm_config_tmp');

  await mkdirp(context.homeDir);
  await mkdirp(context.npmConfigTmp);
}

async function remove(context) {
  if (!context.path) {
    return;
  }
  context.emit(
    'data',
    'silly',
    `${context.module.name} rm.tempdir`,
    context.path
  );
  await rimraf(context.path);
}

module.exports = {
  create,
  remove
};
