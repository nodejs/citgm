// node modules
const fs = require('fs');
const path = require('path');

// npm modules
const readPackage = require('read-package-json');

// local modules
const spawn = require('../spawn');
const createOptions = require('../create-options');
const fetchScript = require('./fetch-script');
const runScript = require('./run-script');

const windows = (process.platform === 'win32');

function authorName(author) {
  if (typeof author === 'string') return author;
  else {
    var parts = [];
    if (author.name) parts.push(author.name);
    if (author.email) parts.push('<' + author.email + '>');
    if (author.url) parts.push('(' + author.url + ')');
    return parts.join(' ');
  }
}

function setup(context, next) {
  var options =
    createOptions(
      path.join(context.path, context.module.name), context);
  var args = ['install', '--loglevel=error'];
  context.emit('data', 'info', 'npm:', 'install started');
  if (context.options.nodedir) {
    var nodedir = path.resolve(process.cwd(),context.options.nodedir);
    options.env.npm_config_nodedir = nodedir;
    args.push('--nodedir="' + nodedir + '"');
    context.emit('data', 'verbose','nodedir', 'Using --nodedir="' + nodedir + '"');
  }
  var proc = spawn('npm', args, options);
  proc.stdout.on('data', function (data) {
    context.emit('data', 'silly', 'npm-install:', data.toString());
  });
  var error = '';
  proc.stderr.on('data', function (chunk) {
    error += chunk;
  });
  proc.on('error', function() {
    next(Error('Install Failed'));
  });
  proc.on('close', function(code) {
    if (error) {
      context.emit('data', 'error', 'npm-install:', error);
    }
    if (code > 0) {
      next(Error('Install Failed'));
      return;
    }
    context.emit('data', 'info', 'npm:', 'install successfully completed');
    next(null, context);
  });
}

function test(context, next) {
  if (context.options.script) {
    fetchScript(context, context.options.script, function(err,script) {
      if (err) {
        next(err);
        return;
      }
      if (!windows) {
        fs.chmodSync(script, '755');
      }
      runScript(context, script, next, 'The canary is dead.');
    });
  } else {

    var wd = path.join(context.path, context.module.name);
    context.emit('data', 'info', 'npm:', 'test suite started');
    readPackage(path.join(wd,'package.json'),false,function(err,data) {
      if (err) {
        next(Error('Package.json Could not be found'));
        return;
      }
      if (data.scripts === undefined ||
          data.scripts.test === undefined) {
        if (data.author) {
          context.emit('data', 'warn', 'notice',
            'Please contact the module developer to request adding npm' +
            ' test support: ' + authorName(data.author));
        }
        next(Error('Module does not support npm-test!'));
        return;
      }

      var options = createOptions(wd, context);
      var proc = spawn('npm', ['test'], options);
      proc.stdout.on('data', function (data) {
        context.emit('data', 'verbose', 'npm-test:', data.toString());
      });
      var error = '';
      proc.stderr.on('data', function (chunk) {
        error += chunk;
      });
      proc.on('error', function() {
        next(Error('Tests Failed'));
      });
      proc.on('close', function(code) {
        if (error) {
          context.emit('data', 'verbose', 'npm:', error);
        }
        if (code > 0) {
          next(Error('The canary is dead.'));
          return;
        }
        next(null, context);
      });

    });
  }
}

module.exports = {
  setup: setup,
  test: test
};
