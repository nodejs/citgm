'use strict';

const path = require('path');

const createOptions = require('./create-options');
const gitClone = require('./git-clone');
const spawn = require('./spawn');

async function grabProject(context) {
  if (context.meta)
    context.emit(
      'data',
      'silly',
      `${context.module.name} package-meta`,
      context.meta
    );
  if (context.module.useGitClone) {
    return gitClone(context);
  }

  return new Promise((resolve, reject) => {
    let packageName = context.module.raw;
    if (context.module.type === 'directory') {
      context.module.raw = context.module.name = path.basename(packageName);
      packageName = path.resolve(process.cwd(), packageName);
    }
    let bailed = false;
    context.emit(
      'data',
      'info',
      `${context.module.name} npm:`,
      `Downloading project: ${packageName}`
    );
    let options = createOptions(context.path, context);
    options.stdio = ['ignore', 'pipe', 'pipe'];
    const proc = spawn('npm', ['pack', packageName], options);

    // Default timeout to 10 minutes if not provided
    const timeout = setTimeout(
      cleanup,
      context.options.timeoutLength || 1000 * 60 * 10
    );

    function cleanup() {
      clearTimeout(timeout);
      bailed = true;
      context.emit(
        'data',
        'error',
        `${context.module.name} npm:`,
        'Download Timed Out'
      );
      proc.kill();
      reject(new Error('Download Timed Out'));
    }

    let filename = '';
    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', (chunk) => {
      filename += chunk;
    });

    let stderr = '';
    proc.stderr.setEncoding('utf8');
    proc.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    proc.on('error', (err) => {
      bailed = true;
      clearTimeout(timeout);
      reject(err);
    });

    proc.on('close', (code) => {
      if (bailed) return;
      clearTimeout(timeout);
      if (code > 0) {
        return reject(new Error(`Failure getting project from npm\n${stderr}`));
      }
      filename = filename.trim();
      if (context.module.type === 'directory') {
        filename = filename.trim().split('\n');
        filename = filename.pop();
      }
      if (filename === '') {
        return reject(new Error(`No project downloaded\n${stderr}`));
      }
      context.emit(
        'data',
        'info',
        `${context.module.name} npm:`,
        `Project downloaded ${filename}`
      );
      context.unpack = path.join(context.path, filename);
      resolve();
    });
  });
}

module.exports = grabProject;
