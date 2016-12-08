var spawn = require('./spawn');
var createOptions = require('./create-options');

function grabModuleData(context, next) {
  // launch npm info as a child process, using the tmp directory
  // as the working directory.
  var proc =
    spawn(
      'npm',
      ['view', '--json', context.module.raw],
      createOptions(
        context.path,
        context));
  var data = '';
  proc.stdout.on('data', function(chunk) {
    data += chunk;
  });
  /* istanbul ignore next: hard to reach error condition */
  proc.on('error', function(err) {
    next(err);
  });
  proc.on('close', function(code) {
    if (code > 0) {
      context.emit('data', 'silly','npm-view','No npm package information available');
      if (context.module.type == 'hosted' &&
          context.module.hosted.type == 'github') {
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
    context.emit('data', 'silly','npm-view','Data retrieved');
     /* istanbul ignore next: hard to reach error condition */
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
