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
  context.emit('data', 'info','npm:','Downloading project: ' + package_name);
  var proc =
    spawn(
      'npm',
      ['pack', package_name],
      createOptions(
        context.path,
        context));
  var filename = '';
  proc.stdout.on('data', function(chunk) {
    filename += chunk;
  });
  proc.on('error', function(err) {
    next(err);
  });
  proc.on('close', function(code) {
    if (code < 0) {
      next(Error('Failure getting project from npm'));
      return;
    }
    filename = filename.trim();
    if (filename === '') {
      next(Error('No project downloaded'));
      return;
    }
    context.emit('data', 'info','npm:','Project downloaded ' + filename);
    context.unpack = path.join(context.path, filename);
    next(null, context);
  });

}

module.exports = grabProject;
