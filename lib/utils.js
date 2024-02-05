import fs from 'node:fs/promises';

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
