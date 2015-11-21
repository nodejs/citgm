// node modules
var path = require('path');
var fs = require('fs');
var util = require('util');

// local modules
var createOptions = require('../create-options');
var spawn = require('../spawn');

function runScript(context, script, next, msg) {
  var _path = path.resolve(process.cwd(), script);
  context.emit('data', 'verbose','script-start',_path);
  fs.exists(_path, function(exists) {
    if (exists) {
      var options =
        createOptions(
          path.join(context.path, context.module.name), context);
      var proc = spawn(_path, [], options);
      proc.stdout.on('data', function (data) {
        context.emit('data', 'info', 'npm:', data.toString());
      });
      var error = '';
      proc.stderr.on('data', function (chunk) {
        error += chunk;
      });
      proc.on('error', function(err) {
        next(err);
      });
      proc.on('close', function(code) {
        if (error) {
          context.emit('data', 'verbose', 'npm-error:', error);
        }
        if (code > 0) {
          msg = msg || util.format('Script %s failed', _path);
          next(Error(msg));
          return;
        }
        context.emit('data', 'verbose','script-end', _path);
        next(null, context);
      });
    } else {
      next(Error(util.format('Script %s does not exist', _path)));
    }
  });
}

module.exports = runScript;
