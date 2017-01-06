// Node modules
const path = require('path');
const fs = require('fs');
const url = require('url');

// Npm modules
const uuid = require('uuid');
let request = require('request'); // Mocked in tests

function fetchScript(context, script, next) {
  script = String(script);
  var dest = path.resolve(context.path, uuid.v4());
  var res = url.parse(script);
  var readStream;
  if (res.protocol !== 'http:' && res.protocol !== 'https:') {
    var _path;
    if (context.options && context.options.lookup && script[0] !== '/') {
      _path = path.resolve(path.dirname(context.options.lookup), script);
    } else {
      _path = path.resolve(process.cwd(), script);
    }
    readStream = fs.createReadStream(_path);
  } else {
    context.emit('data', 'silly', context.module.name + ' fetch-script-start',
        script);
    readStream = request(res.href);
  }

  readStream.on('error', function(err) {
    next(err);
  });

  readStream.on('end', function() {
    context.emit('data', 'silly', context.module.name + ' fetch-script-end',
        dest);
    next(null, dest);
  });

  readStream.pipe(fs.createWriteStream(dest)); // Todo add verification
}

module.exports = fetchScript;
