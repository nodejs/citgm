'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const mkdirp = require('mkdirp');
const tar = require('tar');

function unpack(context, next) {
  if (typeof context.unpack === 'string') {
    fs.exists(context.unpack, (exists) => {
      if (exists) {
        const extractPath = path.join(context.path, context.module.name);
        mkdirp(extractPath, (err) => {
          if (err) {
            return next(err);
          }
          context.emit(
            'data',
            'silly',
            `${context.module.name} gzip-unpack-start`,
            context.unpack
          );
          const gzip = zlib.createGunzip();
          const inp = fs.createReadStream(context.unpack);
          const out = tar.extract({
            cwd: extractPath,
            strip: 1
          });
          const res = inp.pipe(gzip).pipe(out);
          res.on('close', () => {
            context.emit(
              'data',
              'silly',
              `${context.module.name} gzip-unpack-close`,
              context.unpack
            );
            return next(null, context);
          });
          res.on('error', (err) => {
            return next(err);
          });
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
