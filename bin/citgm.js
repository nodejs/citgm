#!/usr/bin/env node
'use strict';
var update = require('../lib/update');
var citgm = require('../lib/citgm');
var logger = require('../lib/out');
var reporter = require('../lib/reporter');
var app = require('commander');
var util = require('util');
var resolve = require('resolve-from');

var pkg = require('../package.json');

var mod;
var script;

app
  .version(pkg.version)
  .arguments('<module> [script]')
  .action(function(m, s) {
    mod = m;
    script = s;
  })
  .option(
    '-v, --verbose [level]',
    'Verbose output (silly, verbose, info, warn, error)',
    /^(silly|verbose|info|warn|error)$/i, 'info')
  .option(
    '-q, --npm-loglevel [level]',
    'Verbose output (silent, error, warn, http, info, verbose, silly)',
    /^(silent|error|warn|http|info|verbose|silly)$/i, 'error')
  .option(
    '-l, --lookup <path>',
    'Use the lookup table provided at <path>'
  )
  .option(
    '-d, --nodedir <path>',
    'Path to the node source to use when compiling native addons'
  )
  .option(
    '-p, --test-path <path>', 'Path to prepend to $PATH when running tests'
  )
  .option(
    '-n, --no-color', 'Turns off colorized output'
  )
  .option(
    '-s, --su', 'Allow running the tool as root.'
  )
  .option(
    '-m, --markdown', 'Output results in markdown'
  )
  .option(
    '-t, --tap [path]', 'Output results in tap with optional file path'
  )
  .option(
    '-x, --junit [path]', 'Output results in junit xml with optional file path'
  )
  .option(
    '-o, --timeout <length>', 'Set timeout for npm install', 1000 * 60 * 10
  )
  .option(
    '-c, --sha <commit-sha>', 'Install module from commit-sha'
  )
  .option(
    '-C, --config <filename>', 'Config file (loaded with `require`)'
  );

if (!citgm.windows) {
  app.option(
    '-u, --uid <uid>', 'Set the uid (posix only)'
  )
  .option(
    '-g, --gid <uid>', 'Set the gid (posix only)'
  );
}

app.parse(process.argv);

var config = app.config ? util._extend(require(resolve(process.cwd(), app.config)), app) : app;

var log = logger({
  level:config.verbose,
  nocolor: !config.color
});

update(log);

if (!config.su) {
  require('root-check')(); // silently downgrade if running as root...
                           // unless --su is passed
} else {
  log.warn('root', 'Running as root! Use caution!');
}

if (!mod) {
  app.outputHelp();
  process.exit(0);
}

var options = {
  script: script,
  lookup: config.lookup,
  nodedir: config.nodedir,
  testPath: config.testPath,
  level: config.verbose,
  npmLevel: config.npmLoglevel,
  timeoutLength: config.timeout,
  sha: config.sha
};

if (!citgm.windows) {
  var uidnumber = require('uid-number');
  var uid = config.uid || process.getuid();
  var gid = config.gid || process.getgid();
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

  runner.on('start', function(name) {
    log.info('starting', name);
  }).on('fail', function(err) {
    log.error('failure', err.message);
  }).on('data', function(type, key, message) {
    log[type](key, message);
  }).on('end', function(module) {
    reporter.logger(log, module);

    if (config.markdown) {
      reporter.markdown(log.bypass, module);
    }

    if (config.tap) {
      // if tap is a string it should be a path to write output to
      // if not use `log.bypass` which is currently process.stdout.write
      // TODO check that we can write to that path, perhaps require a flag to overwrite
      var tap = (typeof config.tap === 'string') ? config.tap : log.bypass;
      reporter.tap(tap, module);
    }
    
    if (app.junit) {
      var junit = (typeof app.junit === 'string') ? app.junit : log.bypass;
      reporter.junit(junit, module);
    }
    
    process.removeListener('SIGINT', cleanup);
    process.removeListener('SIGHUP', cleanup);
    process.removeListener('SIGBREAK', cleanup);
    process.exit(module.error ? 1 : 0);
  }).run();
}
