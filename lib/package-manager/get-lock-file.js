import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function getLockFile(packageManager, context) {
  let lockFileName = 'package-lock.json';

  if (packageManager === 'yarn') {
    lockFileName = 'yarn.lock';
  }
  const lockFilePath = join(context.path, context.module.name, lockFileName);

  try {
    const fileContent = await readFile(lockFilePath, 'utf8');

    return {
      fileName: lockFileName,
      content: fileContent.toString()
    };
  } catch (err) {
    if (err.code === 'ENOENT') {
      return undefined;
    }

    context.emit(
      'data',
      'warn',
      `${context.module.name} ${packageManager}-get-lock-file:`,
      `Failed to read lock file ${lockFileName} ${err.message}`
    );
  }
}
