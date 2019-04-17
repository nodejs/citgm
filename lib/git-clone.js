'use strict';

const path = require('path');
const { promisify } = require('util');

const execa = require('execa');
const mkdirp = promisify(require('mkdirp'));

function getExecGit(path) {
  return function execGit(args) {
    return execa('git', args, {
      cwd: path,
      stdio: 'ignore'
    });
  };
}

async function gitClone(context) {
  const gitUrl = context.module.raw;
  const gitRef = context.module.ref;

  const modulePath = path.join(context.path, context.module.name);
  await mkdirp(modulePath);
  const execGit = getExecGit(modulePath);

  await execGit(['init']);
  await execGit(['remote', 'add', 'origin', gitUrl]);
  await execGit(['fetch', '--depth=1', 'origin', gitRef]);
  await execGit(['checkout', 'FETCH_HEAD']);
  await execGit(['submodule', 'init']);
  await execGit(['submodule', 'update']);

  context.unpack = false;
}

module.exports = gitClone;
