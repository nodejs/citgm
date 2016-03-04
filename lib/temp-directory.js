// node modules
var fs = require('fs');
var path = require('path');

// npm modules
var rimraf = require('rimraf');
var uuid = require('node-uuid');
var osenv = require('osenv');

function create(context, next) {
  var _path = path.join(osenv.tmpdir(),uuid.v4());
  context.path = _path;
  context.emit('data', 'silly', 'mk.tempdir', _path);
  fs.mkdir(_path, function(err) {
    if (err) {
      next(err);
      return;
    }
    next(null,context);
  });
}

function remove(context, next) {
  if (context.path) {
    context.emit('data', 'silly', 'rm.tempdir', context.path);
    rimraf(context.path, function(err) {
      if (err) {
        next(err);
        return;
      }
      next(null, context);
    });
  }
  else {
    next(null, context);
  }
}

module.exports = {
  create: create,
  remove: remove
};
