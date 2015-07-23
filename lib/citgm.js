'use strict';

var chalk = require('chalk');
var os = require('os');
var fs = require('fs');
var rimraf = require('rimraf');
var child = require('child_process');
var zlib = require('zlib');
var path = require('path');
var util = require('util');
var tar = require('tar');
var async = require('async');
var uuid = require('node-uuid');
var EventEmitter = require('events').EventEmitter;

/**
 * The process here is straightforward:
 * 1. We pull down information about the module from npm
 * 2. We create a temporary working directory and pull down the
 *    module using the git repo shown in the npm metadata or,
 *    if the repo is not specified, by pulling the code from
 *    npm itself
 * 3. Once the code is checked out, the init script (if specified)
 *    is run as a child process, with the temporary working directory
 *    as the root. If init script fails, abort
 * 4. If npm test is implemented, invoke to run the tests. Otherwise,
 *    if options.script is provided, run it as a child process.
 * 5. If a teardown script is provided, run it as a child process to
 *    clean up.
 * 6. Filter the output of 4 through the Reporter script (details TBD)
 * 7. Output the results.
 **/

function init(context,next) {
  next(null,context); // inject the context
}

function createTempDirectory(context, next) {
  var _path = path.join(os.tmpdir(),uuid.v4());
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

  var proc = child.spawn('npm', ['view', '--json', context.module], {
    cwd: context.path
     // todo, eventually we'll want uid/gid
  });
  var data = '';
  proc.stdout.on('data', function(chunk) {
    data += chunk;
  });
  proc.on('error', function(err) {
    next(err);
  });
  proc.on('close', function(code) {
    if (code > 0) {
      next(Error('Failure getting npm detail'));
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
  var repository = context.meta.repository;
  if (repository) {
    if (repository.type === 'git') {
      context.emit('info','git-clone-start', 'Cloning project');
      var url = repository.url.replace(/^git\+/,'');
      proc = child.spawn('git', ['clone', url, context.module], {
        cwd: context.path
         // todo, eventually we'll want uid/gid
      });
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
    proc = child.spawn('npm', ['pack', context.module], {
      cwd: context.path
    });
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
      path:path.join(context.path,context.module),
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
      var proc = child.spawn(_path, {
        cwd: path.join(context.path, context.module),
        stdio: [0,1,2]
      });
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

function initscript(context, next) {
  if (context.options.init) {
    runscript(context, context.options.init, next);
  } else {
    next(null, context);
  }
}

function teardownscript(context, next) {
  if (context.options.teardown) {
    runscript(context, context.options.teardown, next);
  } else {
    next(null, context);
  }
}

function npmsetup(context, next) {
  var proc = child.spawn('npm', ['install'], {
    cwd: path.join(context.path, context.module),
    stdio: [0,1,2]
  });
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
    var proc = child.spawn('npm', ['test'], {
      cwd: path.join(context.path, context.module),
      stdio: [0,1,2]
    });
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

/**
 * Setup the test
 *  - module = the name of the npm module to check out
 *  - options.init = path to an initialization script to run
 *  - options.script = path to a test script to run
 *  - options.teardown = path to a teardown script to run
 *  - options.reporter = path to a reporting script to run
 *
 * The Tester will emit specific events once it is run:
 *  - end = emitted when the test is complete
 *  - fail = emitted if the test fails for any reason
 *  - start = emitted when run is started
 **/
function Tester(module, options) {
  if (!(this instanceof Tester))
    return new Tester(module, options);
  EventEmitter.call(this);
  this.module = module;
  this.options = options;
}
util.inherits(Tester,EventEmitter);

Tester.prototype.run = function() {
  this.emit('start', this.module, this.options);
  var self = this;
  async.waterfall([
    init.bind(null, self),
    createTempDirectory,
    grabModuleData,
    grabProject,
    unpack,
    initscript,
    npmsetup,
    npmtest,
    teardownscript
  ], function(err) {
    if (err) self.emit('fail', err);
    removeTempDirectory(self, function() {
      self.emit('end', self.module);
    });
  });
};
exports.Tester = Tester;
