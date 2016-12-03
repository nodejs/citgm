// node modules
var path = require('path');

// npm modules
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var uuid = require('uuid');
var osenv = require('osenv');

function create(context, next) {
  var _path = path.join(osenv.tmpdir(),uuid.v4());
  var npmConfigTmp = path.join(_path, 'npm_config_tmp');

  context.path = _path;
  context.npmConfigTmp = npmConfigTmp;

  context.emit('data', 'silly', context.module.name + ' mk.tempdir', _path);

  mkdirp(npmConfigTmp, function (err) {
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
  context.emit('data', 'silly', context.module.name + ' rm.tempdir', context.path);
  rimraf(context.path, function(err) {
    return next(err, context);
  });
}

module.exports = {
  create: create,
  remove: remove
};
