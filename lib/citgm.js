'use strict';

// node modules
var util = require('util');
var EventEmitter = require('events');

// npm modules
var async = require('async');
var npa = require('npm-package-arg');
var which = require('which');

// local modules
var lookup = require('./lookup');
var grabProject = require('./grab-project');
var unpack = require('./unpack');
var tempDirectory = require('./temp-directory');
var grabModuleData = require('./grab-module-data');
var npm = require('./npm');

var windows = (process.platform === 'win32');
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
    tempDirectory.remove(self, function() {
      var payload = {
        name: self.module.name || self.module.raw,
        error: Error('Process Interupted')
      };
      self.emit('fail', payload.error);
      self.emit('end', payload);
      process.exit(code);
    });
  };
  process.on('SIGINT', cleanup);
  process.on('SIGHUP', cleanup);
  process.on('SIGBREAK', cleanup);

  async.waterfall([
    init.bind(null, self),
    find.bind(null, 'node'),
    find.bind(null, 'npm'),
    tempDirectory.create,
    grabModuleData,
    lookup,
    grabProject,
    unpack,
    npm.setup,
    npm.test
  ], function(err) {
    if (!cleanexit) {
      var payload = {
        name: self.module.name || self.module.raw
      };
      if (err) {
        self.emit('fail', err);
        payload.error = new Error(err);
      }
      tempDirectory.remove(self, function() {
        self.emit('end', payload);
        cleanexit = true;
      });
    }
  });
};

exports.Tester = Tester;
