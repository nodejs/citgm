// node modules
var path = require('path');
var fs = require('fs');
var util = require('util');

// npm modules
var stripAnsi = require('strip-ansi');

// local modules
var createOptions = require('../../create-options');
var spawn = require('../../spawn');

function runScript(context, script, msg, next) {
  var _path = path.resolve(process.cwd(), script);
  if (typeof msg === 'function') {
    next = msg;
    msg = util.format('Script %s failed', _path);
  }
  context.emit('data', 'verbose', context.module.name + ' script-start', _path);
  fs.stat(_path, function(err, stat) {
    if (err || !stat.isFile()) {
      return next(err);
    }
    var options = createOptions(context.path, context);
    var proc = spawn(_path, [], options);
    proc.stdout.on('data', function (data) {
      if (context.module.stripAnsi) {
        data = stripAnsi(data.toString());
        data = data.replace(/\r/g, '\n');
      }
      context.testOutput += data;
      context.emit('data', 'verbose', context.module.name + ' npm-test:', data.toString());
    });
    proc.stderr.on('data', function (data) {
      context.testError += data;
      context.emit('data', 'verbose', context.module.name + ' npm-error:', data.toString());
    });
    proc.on('error', function(err) {
      next(err);
    });
    proc.on('close', function(code) {
      if (code > 0) {
        return next(Error(msg));
      }
      context.emit('data', 'verbose', context.module.name + ' script-end', _path);
      return next(null, context);
    });
  });
}

module.exports = runScript;
