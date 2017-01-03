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
  context.emit('data', 'verbose','script-start', _path);
  fs.stat(_path, function(err, stat) {
    if (err || !stat.isFile()) {
      return next(err);
    }
    var options = createOptions(context.path, context);
    var scriptExtension = path.extname(_path);
    var proc = '';
    if ((['.bat','.cmd'].indexOf(scriptExtension) !== -1 && process.platform === 'win32') ||
     ((['.sh',''].indexOf(scriptExtension) !== -1 && process.platform !== 'win32'))) {
      proc = spawn(_path, [], options);
    } else if (scriptExtension === '.ps1') {
      proc = spawn('powershell.exe',[_path], options);
    } else {
      context.emit('fail', 'verbose', 'unsupported', scriptExtension + ' not supported');
      return next(Error(msg));
    }
    proc.stdout.on('data', function (data) {
      if (context.module.stripAnsi) {
        data = stripAnsi(data.toString());
        data = data.replace(/\r/g, '\n');
      }
      context.testOutput += data;
      context.emit('data', 'verbose', 'npm-test:', data.toString());
    });
    proc.stderr.on('data', function (data) {
      context.testError += data;
      context.emit('data', 'verbose', 'npm-error:', data.toString());
    });
    proc.on('error', function(err) {
      next(err);
    });
    proc.on('close', function(code) {
      if (code > 0) {
        return next(Error(msg));
      }
      context.emit('data', 'verbose','script-end', _path);
      return next(null, context);
    });
  });
}

module.exports = runScript;
