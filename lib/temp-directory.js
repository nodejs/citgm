// node modules
const fs = require('fs');
const path = require('path');

// npm modules
const rimraf = require('rimraf');
const uuid = require('node-uuid');
const osenv = require('osenv');

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
}

module.exports = {
  create: create,
  remove: remove
};
