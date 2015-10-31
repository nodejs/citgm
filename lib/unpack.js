// node modules
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// npm modules
const tar = require('tar');

function unpack(context, next) {
  if (typeof context.unpack === 'string') {
    fs.exists(context.unpack, function(exists) {
      if (exists) {
        context.emit('data', 'silly','gzip-unpack-start',context.unpack);
        var gzip = zlib.createGunzip();
        var inp = fs.createReadStream(context.unpack);
        var out = tar.Extract({
          path:path.join(context.path,context.module.name),
          strip: 1
        });
        var res = inp.pipe(gzip).pipe(out);
        res.on('end', function() {
          context.emit('data', 'silly','gzip-unpack-end',context.unpack);
          next(null, context);
        });
        res.on('error', function(err) {
          next(err);
        });
      } else {
        next(Error('Nothing to unpack... Ending'));
      }
    });
  } else {
    next(Error('Nothing to unpack... Ending'));
  }
}

module.exports = unpack;
