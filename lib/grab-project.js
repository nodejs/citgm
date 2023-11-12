import { createWriteStream } from 'fs';
import path from 'path';
import stream from 'stream';
import { promisify } from 'util';

import undici from 'undici';

import { createOptions } from './create-options.js';
import { gitClone } from './git-clone.js';
import { spawn } from './spawn.js';

const pipeline = promisify(stream.pipeline);

export async function grabProject(context) {
  if (context.module.useGitClone) {
    return gitClone(context);
  }

  return new Promise((resolve, reject) => {
    let packageManager = 'npm';
    if (context.options.yarn || context.module.useYarn) {
      packageManager = 'yarn';
    } else if (context.options.pnpm || context.module.usePnpm) {
      packageManager = 'pnpm';
    }
    let packageName = context.module.raw;
    if (context.module.type === 'directory') {
      context.module.raw = context.module.name = path.basename(packageName);
      packageName = path.resolve(process.cwd(), packageName);
    }
    let bailed = false;
    context.emit(
      'data',
      'info',
      `${context.module.name} ${packageManager}:`,
      `Downloading project: ${packageName}`
    );

    // Default timeout to 10 minutes if not provided.
    const timeout = context.options.timeout || 1000 * 60 * 10;

    if (/^https?:\/\//.test(packageName)) {
      resolve(downloadPackage(packageName, context, timeout));
      return;
    }

    let options = createOptions(context.path, context);
    options.stdio = ['ignore', 'pipe', 'pipe'];
    const proc = spawn('npm', ['pack', packageName], options);

    const timeoutId = setTimeout(cleanup, timeout);

    function cleanup() {
      clearTimeout(timeoutId);
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
      clearTimeout(timeoutId);
      reject(err);
    });

    proc.on('close', (code) => {
      if (bailed) return;
      clearTimeout(timeoutId);
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

async function downloadPackage(packageUrl, context, timeout) {
  const filename = path.basename(packageUrl);
  const out = path.join(context.path, filename);

  const request = await undici.request(packageUrl, {
    headersTimeout: timeout,
    bodyTimeout: timeout,
    maxRedirections: 5
  });

  await pipeline(request.body, createWriteStream(out));

  context.emit(
    'data',
    'info',
    `${context.module.name} npm:`,
    `Project downloaded ${filename}`
  );
  context.unpack = out;
}
