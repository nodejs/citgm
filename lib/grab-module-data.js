'use strict';
const createOptions = require('./create-options');
const spawn = require('./spawn');

function grabModuleData(context, next) {
  // Launch npm info as a child process, using the tmp directory
  // As the working directory.
  const proc =
    spawn(
      'npm',
      ['view', '--json', context.module.raw],
      createOptions(
        context.path,
        context));
  let data = '';
  proc.stdout.on('data', function(chunk) {
    data += chunk;
  });
  proc.on('error', function(err) {
    next(err);
  });
  proc.on('close', function(code) {
    if (code > 0) {
      context.emit('data', 'silly', context.module.name + ' npm-view',
          'No npm package information available');
      if (context.module.type === 'hosted' &&
          context.module.hosted.type === 'github') {
        context.meta = {
          repository : {
            type: 'git',
            url: context.module.hosted.gitUrl
          }
        };
      }
      next(null, context);
      return;
    }
    context.emit('data', 'silly', context.module.name + ' npm-view',
        'Data retrieved');
    try {
      context.meta = JSON.parse(data);
    } catch (ex) {
      next(ex);
      return;
    }
    next(null, context);
  });
}

module.exports = grabModuleData;
