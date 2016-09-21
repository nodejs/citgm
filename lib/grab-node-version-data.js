'use strict';
// npm modules
var which = require('which').sync;

// node modules
var path = require('path');

// local modules
var spawn = require('./spawn');

var cache = {};
function grabOneNodeVersionData (context, nodeBin, cb) {
  if (cache[nodeBin]) {
    return cb(null, cache[nodeBin]);
  }
  var proc = spawn(nodeBin, [
    '-p',
    'process.versions.execPath = process.execPath; JSON.stringify(process.versions)'
  ]);
  var chunks = [];
  proc.stdout.on('data', function (chunk) {
    chunks.push(chunk.toString());
  });
  proc.stdout.on('error', cb);
  proc.stdout.on('close', function () {
    cache[nodeBin] = JSON.parse(chunks.join(''));
    cb(null, cache[nodeBin]);
  });
}

function log(context, step, data) {
  context.emit(
    'data',
    'verbose',
    'npm-' + step + '-versions',
    JSON.stringify(data, null, 4)
  );
}

function grabNodeVersionData (context, cb) {
  // get the test node
  var testNodeBin = 'node';
  if (context.options.testpath) {
    var testPath = context.options.testpath + ':' + process.env.PATH;
    testNodeBin = which('node', {path: testPath});
  }
  context.testNodeBin = testNodeBin;

  // Short circuit if we're not at the right loglevel. We could cache the
  // installNodeBin onto the context like we do with testNodeBin, but it's
  // passed into npm install as nodedir, so we don't really gain anything by
  // joining it with 'node' here ahead of time.
  if (context.options.level !== 'verbose' && context.options.level !== 'silly') {
    return cb(null, context);
  }

  // get the install node
  var installNodeBin = 'node';
  if (context.options.nodedir) {
    installNodeBin = path.join(
      path.resolve(process.cwd(), context.options.nodedir), 'node'
    );
  }

  grabOneNodeVersionData(context, installNodeBin, function (err, data) {
    if (err) {
      return cb(err);
    }
    context.npmInstallVersions = data;
    log(context, 'install', data);
    grabOneNodeVersionData(context, testNodeBin, function (err, data) {
      if (err) {
        return cb(err);
      }
      context.npmTestVersions = data;
      log(context, 'test', data);
      cb(null, context);
    });
  });
}

module.exports = grabNodeVersionData;

