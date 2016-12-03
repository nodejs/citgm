// node modules
var fs = require('fs');
var zlib = require('zlib');
var path = require('path');

// npm modules
var tar = require('tar');

function unpack(context, next) {
  if (typeof context.unpack === 'string') {
    fs.exists(context.unpack, function(exists) {
      if (exists) {
        context.emit('data', 'silly', context.module.name + ' gzip-unpack-start', context.unpack);
        var gzip = zlib.createGunzip();
        var inp = fs.createReadStream(context.unpack);
        var out = tar.Extract({
          path: path.join(context.path,context.module.name),
          strip: 1
        });
        var res = inp.pipe(gzip).pipe(out);
        res.on('end', function() {
          context.emit('data', 'silly', context.module.name + ' gzip-unpack-end', context.unpack);
          return next(null, context);
        });
        res.on('error', function(err) {
          return next(err);
        });
      } else {
        return next(Error('Nothing to unpack... Ending'));
      }
    });
  } else {
    return next(Error('Nothing to unpack... Ending'));
  }
}

module.exports = unpack;
