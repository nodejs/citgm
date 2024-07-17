import { createReadStream, exists, promises as fs } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';

import { extract } from 'tar';

const existsPromise = promisify(exists);

export async function unpack(context) {
  if (typeof context.unpack === 'string') {
    const fileExists = await existsPromise(context.unpack);
    if (!fileExists) {
      throw new Error('Nothing to unpack... Ending');
    }
    const extractPath = join(context.path, context.module.name);
    await fs.mkdir(extractPath, { recursive: true });
    context.emit(
      'data',
      'silly',
      `${context.module.name} gzip-unpack-start`,
      context.unpack
    );
    const inp = createReadStream(context.unpack);
    const gzip = createGunzip();
    const out = extract({
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
