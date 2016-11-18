#!/usr/bin/env node
'use strict';
var update = require('../lib/update');
var citgm = require('../lib/citgm');
var logger = require('../lib/out');
var reporter = require('../lib/reporter');
var commonArgs = require('../lib/common-args');
var yargs = require('yargs');

var mod;
var script;

yargs = commonArgs(yargs)
  .usage('citgm [options] <module> [script]')
  .option('sha', {
    alias: 'c',
    type: 'string',
    description: 'Install module from commit-sha'
  });

var app = yargs.argv;

mod = app._[0];
script = app._[1];

var log = logger({
  level:app.verbose,
  nocolor: app.noColor
});

update(log);

if (!app.su) {
  require('root-check')(); // silently downgrade if running as root...
                           // unless --su is passed
} else {
  log.warn('root', 'Running as root! Use caution!');
}

if (!mod) {
  yargs.showHelp();
  process.exit(0);
}

var options = {
  script: script,
  lookup: app.lookup,
  nodedir: app.nodedir,
  testPath: app.testPath,
  level: app.verbose,
  npmLevel: app.npmLoglevel,
  timeoutLength: app.timeout,
  sha: app.sha
};

if (!citgm.windows) {
  var uidnumber = require('uid-number');
  var uid = app.uid || process.getuid();
  var gid = app.gid || process.getgid();
  uidnumber(uid, gid, function(err, uid, gid) {
    options.uid = uid;
    options.gid = gid;
    launch(mod, options);
  });
} else {
  launch(mod, options);
}

function launch(mod, options) {
  var runner = citgm.Tester(mod, options);

  function cleanup() {
    runner.cleanup();
  }

  process.on('SIGINT', cleanup);
  process.on('SIGHUP', cleanup);
  process.on('SIGBREAK', cleanup);

  var modules = [];

  runner.on('start', function(name, test) {
    log.info('starting', name);
    if (test) {
      log.info('test', test);
    }
  }).on('fail', function(err) {
    log.error('failure', err.message);
  }).on('data', function(type, key, message) {
    log[type](key, message);
  }).on('done', function(result) {
    if (result.error) {
      log.error('done', 'The test suite for ' + result.useName + ' failed');
    } else {
      log.info('done', 'The test suite for ' + result.useName + ' passed.');
    }
    modules.push(result);
  }).on('end', function() {
    reporter.logger(log, modules);

    if (app.markdown) {
      reporter.markdown(log.bypass, modules);
    }

    if (typeof app.tap === 'string') {
      var tap = (app.tap) ? app.tap : log.bypass;
      reporter.tap(tap, modules, app.append);
    }

    if (typeof app.junit === 'string') {
      var junit = (app.junit) ? app.junit : log.bypass;
      reporter.junit(junit, modules, app.append);
    }

    process.removeListener('SIGINT', cleanup);
    process.removeListener('SIGHUP', cleanup);
    process.removeListener('SIGBREAK', cleanup);
    process.exit(reporter.util.hasFailures(modules));
  }).run();
}
