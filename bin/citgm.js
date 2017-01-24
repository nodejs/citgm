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
  })
  .option('tag', {
    alias: 'T',
    type: 'string',
    description: 'Install module from tag'
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
  sha: app.sha,
  tag: app.tag
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

var start = new Date();
function launch(mod, options) {
  var runner = citgm.Tester(mod, options);

  function cleanup() {
    runner.cleanup();
  }

  process.on('SIGINT', cleanup);
  process.on('SIGHUP', cleanup);
  process.on('SIGBREAK', cleanup);

  runner.on('start', function(name) {
    log.info('starting', name);
  }).on('fail', function(err) {
    log.error('failure', err.message);
  }).on('data', function(type, key, message) {
    log[type](key, message);
  }).on('end', function(module) {
    module.duration = new Date() - start;
    reporter.logger(log, module);

    log.info('duration', 'test duration: ' + module.duration + 'ms');
    if (app.markdown) {
      reporter.markdown(log.bypass, module);
    }
    if (app.tap) {
      var tap = (typeof app.tap === 'string') ? app.tap : log.bypass;
      reporter.tap(tap, module, app.append);
    }

    if (app.junit) {
      var junit = (typeof app.junit === 'string') ? app.junit : log.bypass;
      reporter.junit(junit, module, app.append);
    }

    process.removeListener('SIGINT', cleanup);
    process.removeListener('SIGHUP', cleanup);
    process.removeListener('SIGBREAK', cleanup);
    process.exit(module.error ? 1 : 0);
  }).run();
}
