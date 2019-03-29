'use strict';

const child = require('child_process');
const path = require('path');

const mkdirp = require('mkdirp');

function getExecGit(path) {
  return function execGit(args) {
    child.execFileSync('git', args, {
      cwd: path,
      stdio: 'ignore'
    });
  };
}

function gitClone(context, next) {
  const gitUrl = context.module.raw;
  const gitRef = context.module.ref;

  const modulePath = path.join(context.path, context.module.name);
  mkdirp.sync(modulePath);
  const execGit = getExecGit(modulePath);

  try {
    execGit(['init']);
    execGit(['remote', 'add', 'origin', gitUrl]);
    execGit(['fetch', '--depth=1', 'origin', gitRef]);
    execGit(['checkout', '--recurse-submodules', 'FETCH_HEAD']);
  } catch (e) {
    return next(e);
  }

  context.unpack = false;

  next(null, context);
}

module.exports = gitClone;
