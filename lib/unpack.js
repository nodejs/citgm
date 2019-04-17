'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const zlib = require('zlib');

const mkdirp = promisify(require('mkdirp'));
const tar = require('tar');

const fsExists = promisify(fs.exists);

async function unpack(context) {
  if (typeof context.unpack === 'string') {
    const exists = await fsExists(context.unpack);
    if (exists) {
      const extractPath = path.join(context.path, context.module.name);
      await mkdirp(extractPath);
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
      await new Promise((resolve, reject) => {
        res.on('close', () => {
          context.emit(
            'data',
            'silly',
            `${context.module.name} gzip-unpack-close`,
            context.unpack
          );
          resolve();
        });
        res.on('error', (err) => {
          reject(err);
        });
      });
    } else {
      throw new (Error('Nothing to unpack... Ending'))();
    }
  } else if (context.unpack === false) {
    return;
  } else {
    throw new (Error('Nothing to unpack... Ending'))();
  }
}

module.exports = unpack;
