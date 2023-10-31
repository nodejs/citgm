import install from './install.js';
import { test } from './test.js';
import { getExecutable } from './get-executable.js';
import { getLockFile } from './get-lock-file.js';

export function pkgInstall(context) {
  if (context.options.yarn || context.module.useYarn) {
    return install('yarn', context);
  } else {
    return install('npm', context);
  }
}

export function pkgTest(context) {
  if (context.options.yarn || context.module.useYarn) {
    return test('yarn', context);
  } else {
    return test('npm', context);
  }
}

export async function getPackageManagers() {
  const [npm, yarn] = await Promise.all([
    getExecutable('npm'),
    getExecutable('yarn')
  ]);
  return { npm, yarn };
}

export function getLockFileContent(context) {
  if (context.options.yarn || context.module.useYarn) {
    return getLockFile('yarn', context);
  } else {
    return getLockFile('npm', context);
  }
}
