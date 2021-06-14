import { promisify } from 'util';
import { join } from 'path';
import { promises as fs } from 'fs';

import rimrafLib from 'rimraf';
import { v4 as uuid } from 'uuid';
import osenv from 'osenv';

const rimraf = promisify(rimrafLib);

export async function create(context) {
  if (context.options && context.options.tmpDir) {
    context.path = join(context.options.tmpDir, uuid());
  } else {
    context.path = join(osenv.tmpdir(), uuid());
  }
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
  await rimraf(context.path);
};

// Used in tests to simulate errors in rimraf.
export function __test__setRemove(newRemove) {
  remove = newRemove;
}
