'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const zlib = require('zlib');
const { mkdir } = fs.promises;

const stream = require('readable-stream');
const tar = require('tar');

const fsExists = promisify(fs.exists);
const pipeline = promisify(stream.pipeline);

async function unpack(context) {
  if (typeof context.unpack === 'string') {
    const exists = await fsExists(context.unpack);
    if (!exists) {
      throw new Error('Nothing to unpack... Ending');
    }
    const extractPath = path.join(context.path, context.module.name);
    await mkdir(extractPath, { recursive: true });
    context.emit(
      'data',
      'silly',
      `${context.module.name} gzip-unpack-start`,
      context.unpack
    );
    const inp = fs.createReadStream(context.unpack);
    const gzip = zlib.createGunzip();
    const out = tar.extract({
      cwd: extractPath,
      strip: 1
    });
    await pipeline(inp, gzip, out);
    context.emit(
      'data',
      'silly',
      `${context.module.name} gzip-unpack-done`,
      context.unpack
    );
  } else if (context.unpack === false) {
    return;
  } else {
    throw new Error('Nothing to unpack... Ending');
  }
}

module.exports = unpack;
