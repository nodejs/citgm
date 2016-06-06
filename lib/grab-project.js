// node modules
var path = require('path');

// local modules
var spawn = require('./spawn');
var createOptions = require('./create-options');

function grabProject(context, next) {
  if (context.meta)
    context.emit('data', 'silly', 'package-meta', context.meta);
  var package_name = context.module.raw;
  if (context.module.type === 'local') {
    package_name = path.resolve(process.cwd(),package_name);
  }
  var bailed = false;
  context.emit('data', 'info','npm:','Downloading project: ' + package_name);
  var proc =
    spawn(
      'npm',
      ['pack', package_name],
      createOptions(
        context.path,
        context));

  var filename = '';
  
  // default timeout to 10 minutes if not provided
  var timeout = setTimeout(cleanup, context.options.timeoutLength || 1000 * 60 * 10);

  function cleanup() {
    clearTimeout(timeout);
    bailed = true;
    context.emit('data', 'error', 'npm:', 'Download Timed Out');
    proc.kill();
    return next(Error('Download Timed Out'));
  }
  
  proc.stdout.on('data', function(chunk) {
    filename += chunk;
  });
  proc.on('error', function(err) {
    return next(err);
  });
  proc.on('close', function(code) {
    if (bailed) return;
    clearTimeout(timeout);
    if (code > 0) {
      return next(Error('Failure getting project from npm'));
    }
    filename = filename.trim();
    if (filename === '') {
      return next(Error('No project downloaded'));
    }
    context.emit('data', 'info','npm:','Project downloaded ' + filename);
    context.unpack = path.join(context.path, filename);
    return next(null, context);
  });

}

module.exports = grabProject;
