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
var lookup = require('./lookup');
var readPackage = require('read-package-json');

var windows = (process.platform === 'win32');
exports.windows = windows;

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
  if (!windows) {
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
  if (!windows) {
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

function spawn(cmd, args, options) {
  if (windows) {
    args = ['/c', cmd].concat(args);
    cmd = 'cmd';
  }
  return child.spawn(cmd, args, options);
}

function grabModuleData(context, next) {
  // launch npm info as a child process, using the tmp directory
  // as the working directory. The output will be piped into a
  // temporary file.
  var proc =
    spawn(
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
  if (context.meta)
    context.emit('info', 'package-meta', context.meta);
  var package_name = context.module.raw;
  if (context.module.type === 'local') {
    package_name = path.resolve(process.cwd(),package_name);
  }
  context.emit('info','npm-pack-start','Downloading project: ' + package_name);
  var proc =
    spawn(
      'npm',
      ['pack', package_name],
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
    if (filename === '') {
      next(Error('No project downloaded'));
      return;
    }
    context.emit('info','npm-pack-end','Project downloaded ' + filename);
    context.unpack = path.join(context.path, filename);
    next(null, context);
  });

}

function unpack(context, next) {
  if (typeof context.unpack === 'string') {
    fs.exists(context.unpack, function(exists) {
      if (exists) {
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
        next(Error('Nothing to unpack... Ending'));
      }
    });
  } else {
    next(Error('Nothing to unpack... Ending'));
  }
}

function fetchscript(context, script, next) {
  var url = require('url');
  var res = url.parse(String(script));
  if (res.protocol === 'http:' ||
      res.protocol === 'https:') {
    context.emit('info', 'fetch-script-start', String(script));
    var dest = path.resolve(context.path, uuid.v4());
    var request = require('request');

    var hmac, check;

    var req = request(res.href).
      on('error', function(err) {
        next(err);
      }).
      on('end', function() {
        if (hmac) {
          var res = hmac.digest('base64');
          context.emit('info', 'fetch-script-hmac', 'Calculated HMAC: ' + res);
          if (res != check) {
            next(Error('Error: Invalid HMAC!'));
            return;
          }
        }
        context.emit('info', 'fetch-script-end', dest);
        next(null,dest);
      });

    if (context.options.hmac) {
      req.on('response', function(response) {
        check = response.headers['content-hmac'];
        if (check) {
          var parts = check.split(' ',2);
          hmac = require('crypto').createHmac(parts[0], context.options.hmac);
          check = parts[1];
          context.emit('info', 'fetch-script-hmac', 'Content-HMAC: ' + check);
          context.emit('info', 'fetch-script-hmac', 'Algorithm: ' + parts[0]);
        } else {
          context.emit('info', 'fetch-script-warn', 'No Content-HMAC Provided');
        }
      });
      req.on('data', function(chunk) {
        if (hmac) hmac.update(chunk);
      });
    }

    req.pipe(fs.createWriteStream(dest)); // todo add verification
  } else {
    next(null,path.resolve(process.cwd(),String(script)));
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
      var proc = spawn(_path, [], options);
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
  var args = ['install'];
  if (context.options.nodedir) {
    var nodedir = path.resolve(process.cwd(),context.options.nodedir);
    args.push('--nodedir="' + nodedir + '"');
    context.emit('info','nodedir', 'Using --nodedir="' + nodedir + '"');
  }
  var proc = spawn('npm', args, options);
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

function npmtest(context, next) {
  if (context.options.script) {
    fetchscript(context, context.options.script, function(err,script) {
      if (err) {
        next(err);
        return;
      }
      if (!windows) {
        fs.chmodSync(script, '755');
      }
      runscript(context, script, next, 'The canary is dead.');
    });
  } else {

    var wd = path.join(context.path, context.module.name);
    readPackage(path.join(wd,'package.json'),false,function(err,data) {
      if (err) {
        next(Error('Package.json Could not be found'));
        return;
      }
      if (data.scripts === undefined ||
          data.scripts.test === undefined) {
        if (data.author) {
          context.emit('info', 'notice',
            'Please contact the module developer to request adding npm' +
            ' test support: ' + authorName(data.author));
        }
        next(Error('Module does not support npm test!'));
        return;
      }

      var options = createOptions(wd,[0,1,2],context);
      var proc = spawn('npm', ['test'], options);
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
  var cleanexit = false;

  var cleanup = function(code) {
    cleanexit = true;
    removeTempDirectory(self, function() {
      self.emit('fail', Error('Process Interupted'));
      self.emit('end', self.module.raw);
      process.exit(1);
    });
  };
  process.on('SIGINT', cleanup);
  process.on('SIGHUP', cleanup);
  process.on('SIGBREAK', cleanup);

  async.waterfall([
    init.bind(null, self),
    find.bind(null, 'node'),
    find.bind(null, 'npm'),
    createTempDirectory,
    grabModuleData,
    lookup,
    grabProject,
    unpack,
    npmsetup,
    npmtest,
  ], function(err) {
    if (!cleanexit) {
      if (err) self.emit('fail', err);
      removeTempDirectory(self, function() {
        self.emit('end', self.module.raw);
        cleanexit = true;
      });
    }
  });
};
exports.Tester = Tester;
