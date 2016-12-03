// node modules
var path = require('path');
var fs = require('fs');
var url = require('url');

// npm modules
var uuid = require('uuid');
var request = require('request');

function fetchScript(context, script, next) {
  script = String(script);
  var dest = path.resolve(context.path, uuid.v4());
  var res = url.parse(script);
  var readStream;
  if (res.protocol !== 'http:' && res.protocol !== 'https:') {
    var _path;
    if (context.options && context.options.lookup && script[0] !== '/') {
      _path = path.resolve(path.dirname(context.options.lookup), script);
    }
    else {
      _path = path.resolve(process.cwd(), script);
    }
    readStream = fs.createReadStream(_path);
  }
  else {
    context.emit('data', 'silly', context.module.name + ' fetch-script-start', script);
    readStream = request(res.href);
  }

  readStream.on('error', function(err) {
    next(err);
  });

  readStream.on('end', function() {
    context.emit('data', 'silly', context.module.name + ' fetch-script-end', dest);
    next(null, dest);
  });

  readStream.pipe(fs.createWriteStream(dest)); // todo add verification
}

module.exports = fetchScript;
