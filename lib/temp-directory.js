'use strict';
// Node modules
let path = require('path'); // Mocked in tests

// Npm modules
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const uuid = require('uuid');
const osenv = require('osenv');

function create(context, next) {
  if (context.options && context.options.tmpDir) {
    context.path = path.join(context.options.tmpDir, uuid.v4());
  } else {
    context.path = path.join(osenv.tmpdir(), uuid.v4());
  }
  context.emit('data', 'verbose', context.module.name + ' mk.tempdir',
      context.path);

  context.npmConfigTmp = path.join(context.path, 'npm_config_tmp');

  mkdirp(context.npmConfigTmp, function (err) {
    if (err) {
      return next(err);
    }
    return next(null, context);
  });
}

function remove(context, next) {
  if (!context.path) {
    return next(null, context);
  }
  context.emit('data', 'silly', context.module.name + ' rm.tempdir',
      context.path);
  rimraf(context.path, function(err) {
    return next(err, context);
  });
}

module.exports = {
  create: create,
  remove: remove
};
