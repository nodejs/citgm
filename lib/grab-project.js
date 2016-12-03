// node modules
var path = require('path');

// local modules
var spawn = require('./spawn');
var createOptions = require('./create-options');

function grabProject(context, next) {
  if (context.meta)
    context.emit('data', 'silly', context.module.name + ' package-meta', context.meta);
  var packageName = context.module.raw;
  if (context.module.type === 'local') {
    context.module.raw = context.module.name = path.basename(packageName);
    packageName = path.resolve(process.cwd(), packageName);
  }
  var bailed = false;
  context.emit('data', 'info', context.module.name + ' npm:', 'Downloading project: ' + packageName);
  var proc =
    spawn(
      'npm',
      ['pack', packageName],
      createOptions(
        context.path,
        context));

  var filename = '';

  // default timeout to 10 minutes if not provided
  var timeout = setTimeout(cleanup, context.options.timeoutLength || 1000 * 60 * 10);

  function cleanup() {
    clearTimeout(timeout);
    bailed = true;
    context.emit('data', 'error', context.module.name + ' npm:', 'Download Timed Out');
    proc.kill();
    return next(Error('Download Timed Out'));
  }

  proc.stdout.on('data', function(chunk) {
    filename += chunk;
  });

  proc.on('error', function(err) {
    bailed = true;
    clearTimeout(timeout);
    return next(err);
  });

  proc.on('close', function(code) {
    if (bailed) return;
    clearTimeout(timeout);
    if (code > 0) {
      return next(Error('Failure getting project from npm'));
    }
    filename = filename.trim();
    if (context.module.type === 'local') {
      filename = filename.trim().split('\n');
      filename = filename.pop();
    }
    if (filename === '') {
      return next(Error('No project downloaded'));
    }
    context.emit('data', 'info', context.module.name + ' npm:', 'Project downloaded ' + filename);
    context.unpack = path.join(context.path, filename);
    return next(null, context);
  });

}

module.exports = grabProject;
