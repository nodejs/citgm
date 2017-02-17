'use strict';
const fs = require('fs');
const path = require('path');
const url = require('url');

const uuid = require('uuid');
let request = require('request'); // Mocked in tests

function fetchScript(context, script, next) {
  script = String(script);
  const dest = path.resolve(context.path, uuid.v4());
  const res = url.parse(script);
  let readStream;
  if (res.protocol !== 'http:' && res.protocol !== 'https:') {
    let _path;
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
