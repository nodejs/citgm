'use strict';

const os = require('os');
const fs = require('fs');
const rimraf = require('rimraf');
const child = require('child_process');
const zlib = require('zlib');
const path = require('path');
const util = require('util');
const tar = require('tar');
const async = require('async');
const osenv = require('osenv');
const uuid = require('node-uuid');
const npa = require('npm-package-arg');
const which = require('which');
const EventEmitter = require('events');
const lookup = require('./lookup');
const readPackage = require('read-package-json');

const windows = (process.platform === 'win32');
exports.windows = windows;

/**
 * The process here is straightforward:
 * 1. We pull down information about the module from npm
 * 2. We create a temporary working directory and pull down the
 *    module using the git repo shown in the npm metadata or,
 *    if the repo is not specified, by pulling the code from
 *    npm itself
 * 3. If npm-test is implemented, invoke to run the tests. Otherwise,
 *    if options.script is provided, run it as a child process.
 * 4. Filter the output of 4 through the Reporter script (details TBD)
 * 5. Output the results.
 **/

function createOptions(cwd, context) {
  var options = {
    cwd: cwd
  };
  if (!windows) {
    if (context.options.uid) options.uid = context.options.uid;
    if (context.options.gid) options.gid = context.options.gid;
  }
  options.env = Object.create(process.env);
  options.env.npm_loglevel = 'error';
  return options;
}

function find(app, context, next) {
  which(app, function(err, resolved) {
    if (err) {
      next(Error(app + ' not found in path!'));
      return;
    }
    context.emit('data', 'verbose', 'using-' + app, resolved);
    next(null, context);
  });
}

function init(context,next) {
  if (!windows) {
    if (context.options.uid)
      context.emit('data', 'verbose','using-uid',context.options.uid);
    if (context.options.gid)
      context.emit('data', 'verbose','using-gid',context.options.gid);
  }
  context.emit('data', 'silly', 'init-detail', context.module);
  next(null,context); // inject the context
}

function createTempDirectory(context, next) {
  var _path = path.join(osenv.tmpdir(),uuid.v4());
  context.path = _path;
  context.emit('data', 'silly', 'mk.tempdir', _path);
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
    context.emit('data', 'silly', 'rm.tempdir', context.path);
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

function unpack(context, next) {
  if (typeof context.unpack === 'string') {
    fs.exists(context.unpack, function(exists) {
      if (exists) {
        context.emit('data', 'silly','gzip-unpack-start',context.unpack);
        var gzip = zlib.createGunzip();
        var inp = fs.createReadStream(context.unpack);
        var out = tar.Extract({
          path:path.join(context.path,context.module.name),
          strip: 1
        });
        var res = inp.pipe(gzip).pipe(out);
        res.on('end', function() {
          context.emit('data', 'silly','gzip-unpack-end',context.unpack);
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
    context.emit('data', 'silly', 'fetch-script-start', String(script));
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
          context.emit('data', 'silly', 'fetch-script-hmac', 'Calculated HMAC: ' + res);
          if (res != check) {
            next(Error('Error: Invalid HMAC!'));
            return;
          }
        }
        context.emit('data', 'silly', 'fetch-script-end', dest);
        next(null,dest);
      });

    if (context.options.hmac) {
      req.on('response', function(response) {
        check = response.headers['content-hmac'];
        if (check) {
          var parts = check.split(' ',2);
          hmac = require('crypto').createHmac(parts[0], context.options.hmac);
          check = parts[1];
          context.emit('data', 'silly', 'fetch-script-hmac', 'Content-HMAC: ' + check);
          context.emit('data', 'silly', 'fetch-script-hmac', 'Algorithm: ' + parts[0]);
        } else {
          context.emit('data', 'warn', 'fetch-script-warn', 'No Content-HMAC Provided');
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
  context.emit('data', 'verbose','script-start',_path);
  fs.exists(_path, function(exists) {
    if (exists) {
      var options =
        createOptions(
          path.join(context.path, context.module.name), context);
      var proc = spawn(_path, [], options);
      proc.stdout.on('data', function (data) {
        context.emit('data', 'info', 'npm:', data.toString());
      });
      var error = '';
      proc.stderr.on('data', function (chunk) {
        error += chunk;
      });
      proc.on('error', function(err) {
        next(err);
      });
      proc.on('close', function(code) {
        if (error) {
          context.emit('data', 'verbose', 'npm-error:', error);
        }
        if (code > 0) {
          msg = msg || util.format('Script %s failed', _path);
          next(Error(msg));
          return;
        }
        context.emit('data', 'verbose','script-end', _path);
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
  proc.on('error', function(err) {
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
      proc.on('error', function(err) {
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
