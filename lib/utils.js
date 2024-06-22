import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';

import npa from 'npm-package-arg';

/**
 * Remove directory recursively with retries for Windows.
 * @param path
 */
export async function removeDirectory(path) {
  await fs.rm(path, {
    recursive: true,
    force: true,
    maxRetries: 10,
    retryDelay: 50
  });
}

function sha1(mod) {
  const shasum = createHash('sha1');
  shasum.update(mod);
  return shasum.digest('hex');
}

export function parsePackageArg(mod) {
  const detail = npa(mod); // Will throw if mod is invalid
  detail.name = detail.name || `noname-${sha1(mod)}`;
  if (detail.fetchSpec === '*') {
    detail.fetchSpec = 'latest';
  }
  return detail;
}
