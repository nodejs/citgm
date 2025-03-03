import { join } from 'path';
import { promises as fs, realpathSync } from 'fs';
import { randomBytes } from 'crypto';
import { tmpdir } from 'os';

import { removeDirectory } from './utils.js';

export async function create(context) {
  if (context.options && context.options.tmpDir) {
    context.path = join(context.options.tmpDir, randomBytes(4).toString('hex'));
  } else {
    context.path = join(tmpdir(), randomBytes(4).toString('hex'));
  }

  await fs.mkdir(context.path, { recursive: true });
  context.path = realpathSync(context.path);

  context.emit(
    'data',
    'verbose',
    `${context.module.name} mk.tempdir`,
    context.path
  );

  context.homeDir = join(context.path, 'home');
  context.npmConfigTmp = join(context.path, 'npm_config_tmp');

  await fs.mkdir(context.homeDir, { recursive: true });
  await fs.mkdir(context.npmConfigTmp, { recursive: true });
}

export let remove = async function remove(context) {
  if (!context.path) {
    return;
  }
  context.emit(
    'data',
    'silly',
    `${context.module.name} rm.tempdir`,
    context.path
  );
  await removeDirectory(context.path);
};

// Used in tests to simulate errors in rimraf.
export function __test__setRemove(newRemove) {
  remove = newRemove;
}
