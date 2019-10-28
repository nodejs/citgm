'use strict';

const createOptions = require('./create-options');
const spawn = require('./spawn');

function grabModuleData(context) {
  return new Promise((resolve, reject) => {
    // Launch npm info as a child process, using the tmp directory
    // As the working directory.
    const proc = spawn(
      'npm',
      ['view', '--json', context.module.raw],
      createOptions(context.path, context)
    );
    let data = '';
    proc.stdout.on('data', (chunk) => {
      data += chunk;
    });
    proc.once('error', (err) => {
      reject(err);
    });
    proc.on('close', (code) => {
      if (code > 0) {
        context.emit(
          'data',
          'silly',
          `${context.module.name} npm-view`,
          'No npm package information available'
        );
        if (
          context.module.type === 'git' &&
          context.module.hosted.type === 'github'
        ) {
          context.meta = {
            repository: {
              type: 'git',
              url: context.module.hosted.git()
            }
          };
        }
        resolve();
        return;
      }

      if (data === '') {
        reject(
          new Error(`No module version found satisfying ${context.module.raw}`)
        );
        return;
      }

      context.emit(
        'data',
        'silly',
        `${context.module.name} npm-view`,
        'Data retrieved'
      );

      try {
        context.meta = JSON.parse(data);
        if (Array.isArray(context.meta)) {
          // A semver range was passed and multiple versions matched.
          // Use the last compatible version.
          context.meta = context.meta[context.meta.length - 1];
        }
      } catch (ex) {
        reject(ex);
        return;
      }
      resolve();
    });
  });
}

module.exports = grabModuleData;
