'use strict';

var os = require('os');
var fs = require('fs');
var rimraf = require('rimraf');
var child = require('child_process');
var zlib = require('zlib');
var path = require('path');
var util = require('util');
var tar = require('tar');
var async = require('async');
var osenv = require('osenv');
var uuid = require('node-uuid');
var npa = require('npm-package-arg');
var which = require('which');
var EventEmitter = require('events').EventEmitter;

/**
 * The process here is straightforward:
 * 1. We pull down information about the module from npm
 * 2. We create a temporary working directory and pull down the
 *    module using the git repo shown in the npm metadata or,
 *    if the repo is not specified, by pulling the code from
 *    npm itself
 * 3. If npm test is implemented, invoke to run the tests. Otherwise,
 *    if options.script is provided, run it as a child process.
 * 4. Filter the output of 4 through the Reporter script (details TBD)
 * 5. Output the results.
 **/

function createOptions(cwd, stdio, context) {
  var options = {
    cwd: cwd
  };
  if (stdio) options.stdio = stdio;
  if (process.platform !== 'win32') {
    if (context.options.uid) options.uid = context.options.uid;
    if (context.options.gid) options.gid = context.options.gid;
  }
  return options;
}

function find(app, context, next) {
  which(app, function(err, resolved) {
    if (err) {
      next(Error(app + ' not found in path!'));
      return;
    }
    context.emit('info', 'using-' + app, resolved);
    next(null, context);
  });
}

function init(context,next) {
  if (process.platform !== 'win32') {
    if (context.options.uid)
      context.emit('info','using-uid',context.options.uid);
    if (context.options.gid)
      context.emit('info','using-gid',context.options.gid);
  }
  context.emit('info', 'init-detail', context.module);
  next(null,context); // inject the context
}

function createTempDirectory(context, next) {
  var _path = path.join(osenv.tmpdir(),uuid.v4());
  context.path = _path;
  context.emit('info', 'mk.tempdir', _path);
  fs.mkdir(_path, function(err) {
    if (err) {
      next(err);
      return;
    }
    next(null,context);
  });
}

function removeTempDirectory(context, next) {
  if (context.path) {
    context.emit('info', 'rm.tempdir', context.path);
    rimraf(context.path, function(err) {
      if (err) {
        next(err);
        return;
      }
      next(null, context);
    });
  }
}

function grabModuleData(context, next) {
  // launch npm info as a child process, using the tmp directory
  // as the working directory. The output will be piped into a
  // temporary file.
  var proc =
    child.spawn(
      'npm',
      ['view', '--json', context.module.raw],
      createOptions(
        context.path,
        undefined,
        context));
  var data = '';
  proc.stdout.on('data', function(chunk) {
    data += chunk;
  });
  proc.on('error', function(err) {
    next(err);
  });
  proc.on('close', function(code) {
    if (code > 0) {
      context.emit('info','npm-view','No npm package information available');
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
    context.emit('info','npm-view','Data retrieved');
    try {
      context.meta = JSON.parse(data);
    } catch (ex) {
      next(ex);
      return;
    }
    next(null, context);
  });
}

function grabProject(context, next) {
  var proc;
  if (!context.meta) {
    next(Error('No repository metadata!'));
    return;
  }
  context.emit('info', 'package-meta', context.meta);
  var repository = context.meta.repository;
  if (repository) {
    if (repository.type === 'git') {
      context.emit('info','git-clone-start', 'Cloning project');
      var url = repository.url.replace(/^git\+/,'');
      proc =
        child.spawn(
          'git',
          ['clone', url, context.module.name],
          createOptions(
            context.path,
            undefined,
            context));
      proc.on('close', function(code) {
        if (code > 0) {
          next(Error('Failure getting project from git'));
          return;
        }
        context.emit('info','git-clone-end','Project cloned');
        next(null, context);
      });
    } else {
      // whoops! what to do now? fail for now
      next(Error(
        util.format(
          'Unknown repository type [%s]',
          repository.type)));
    }
  } else {
    context.emit('info','npm-pack-start','Downloading project');
    proc =
      child.spawn(
        'npm',
        ['pack', context.module.raw],
        createOptions(
          context.path,
          undefined,
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
      context.emit('info','npm-pack-end','Project downloaded ' + filename);
      context.unpack = path.join(context.path, filename);
      next(null, context);
    });
  }
}

function unpack(context, next) {
  if (context.unpack) {
    context.emit('info','gzip-unpack-start',context.unpack);
    var gzip = zlib.createGunzip();
    var inp = fs.createReadStream(context.unpack);
    var out = tar.Extract({
      path:path.join(context.path,context.module.name),
      strip: 1
    });
    var res = inp.pipe(gzip).pipe(out);
    res.on('end', function() {
      context.emit('info','gzip-unpack-end',context.unpack);
      next(null, context);
    });
    res.on('error', function(err) {
      next(err);
    });
  } else {
    next(null, context);
  }
}

function runscript(context, script, next, msg) {
  var _path = path.resolve(process.cwd(), script);
  context.emit('info','script-start',_path);
  fs.exists(_path, function(exists) {
    if (exists) {
      var options =
        createOptions(
          path.join(context.path, context.module.name),
          [0,1,2], context);
      var proc = child.spawn(_path, options);
      proc.on('error', function(err) {
        next(err);
      });
      proc.on('close', function(code) {
        if (code > 0) {
          msg = msg || util.format('Script %s failed', _path);
          next(Error(msg));
          return;
        }
        context.emit('info','script-end', _path);
        next(null, context);
      });
    } else {
      next(Error(util.format('Script %s does not exist', _path)));
    }
  });
}

function npmsetup(context, next) {
  var options =
    createOptions(
      path.join(context.path, context.module.name),
      [0,1,2],
      context);
  var proc = child.spawn('npm', ['install'], options);
  proc.on('error', function(err) {
    next(Error('Install Failed'));
  });
  proc.on('close', function(code) {
    if (code > 0) {
      next(Error('Install Failed'));
      return;
    }
    next(null, context);
  });
}

function npmtest(context, next) {
  if (context.options.script) {
    runscript(context, context.options.script, next, 'The canary is dead.');
  } else {
    var options =
      createOptions(
        path.join(context.path, context.module.name),
        [0,1,2],
        context
      );
    var proc = child.spawn('npm', ['test'], options);
    proc.on('error', function(err) {
      next(Error('Tests Failed'));
    });
    proc.on('close', function(code) {
      if (code > 0) {
        next(Error('The canary is dead.'));
        return;
      }
      next(null, context);
    });
  }
}

function sha1(mod) {
  var crypto = require('crypto');
  var shasum = crypto.createHash('sha1');
  shasum.update(mod);
  return shasum.digest('hex');
}

function extractDetail(mod) {
  var detail = npa(mod); // will throw on failure
  detail.name = detail.name || sha1(mod);
  return detail;
}

/**
 * Setup the test
 *  - module = the name of the npm module to check out
 *  - options.script = path to a test script to run
 *  - options.reporter = path to a reporting script to run
 *
 * The Tester will emit specific events once it is run:
 *  - end = emitted when the test is complete
 *  - fail = emitted if the test fails for any reason
 *  - info = informational events (for debugging)
 *  - start = emitted when run is started
 **/
function Tester(mod, options) {
  if (!(this instanceof Tester))
    return new Tester(mod, options);
  EventEmitter.call(this);
  this.module = extractDetail(mod);
  this.options = options;
}
util.inherits(Tester,EventEmitter);

Tester.prototype.run = function() {
  this.emit('start', this.module.raw, this.options);
  var self = this;
  async.waterfall([
    init.bind(null, self),
    find.bind(null, 'node'),
    find.bind(null, 'npm'),
    createTempDirectory,
    grabModuleData,
    grabProject,
    unpack,
    npmsetup,
    npmtest,
  ], function(err) {
    if (err) self.emit('fail', err);
    removeTempDirectory(self, function() {
      self.emit('end', self.module.raw);
    });
  });
};
exports.Tester = Tester;
