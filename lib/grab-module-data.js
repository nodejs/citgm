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
    proc.on('error', (err) => {
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
      context.emit(
        'data',
        'silly',
        `${context.module.name} npm-view`,
        'Data retrieved'
      );
      try {
        context.meta = JSON.parse(data);
      } catch (ex) {
        reject(ex);
        return;
      }
      resolve();
    });
  });
}

module.exports = grabModuleData;
