#!/usr/bin/env node
'use strict';
var app = require('commander');
var async = require('async');

var update = require('../lib/update');
var citgm = require('../lib/citgm');
var logger = require('../lib/out');
var reporter = require('../lib/reporter');
var getLookup = require('../lib/lookup').get;

var pkg = require('../package.json');

app
  .version(pkg.version)
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
  ).option(
    '-o, --timeout <length>', 'Output results in tap with optional file path', 1000 * 60 * 10
  )
  .option(
    '-f, --fail-flaky', 'Ignore flaky flags. Don\'t ignore any failures.'
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

var log = logger({
  level: app.verbose,
  nocolor: !app.color
});

update(log);

if (!app.su) {
  require('root-check')(); // silently downgrade if running as root...
                           // unless --su is passed
} else {
  log.warn('root', 'Running as root! Use caution!');
}

var options = {
  lookup: app.lookup,
  nodedir: app.nodedir,
  testPath: app.testPath,
  failFlaky: app.failFlaky,
  level: app.verbose,
  npmLevel: app.npmLoglevel,
  timeoutLength: app.timeout
};

var lookup = getLookup(options);

if (!citgm.windows) {
  var uidnumber = require('uid-number');
  var uid = app.uid || process.getuid();
  var gid = app.gid || process.getgid();
  uidnumber(uid,gid, function(err, uid, gid) {
    options.uid = uid;
    options.gid = gid;
    launch(options);
  });
} else {
  launch(options);
}

var modules = [];

function runCitgm (mod, name, next) {
  if (mod.skip) {
    return next();
  }
  
  var runner = citgm.Tester(name, options);
  var bailed = false;

  function cleanup() {
    bailed = true;
    runner.cleanup();
  }

  process.on('SIGINT', cleanup);
  process.on('SIGHUP', cleanup);
  process.on('SIGBREAK', cleanup);
  
  runner.on('start', function(name) {
    log.info('starting', name);
  }).on('fail', function(err) {
    log.error('failure', err.message);
  }).on('data', function(type,key,message) {
    log[type](key, message);
  }).on('end', function(result) {
    if (result.error) {
      log.error('done', 'The test suite for ' + result.name + ' version ' + result.version + ' failed');
    }
    else {
      log.info('done', 'The test suite for ' + result.name + ' version ' + result.version + ' passed.');
    }
    modules.push(result);
    process.removeListener('SIGINT', cleanup);
    process.removeListener('SIGHUP', cleanup);
    process.removeListener('SIGBREAK', cleanup);
    return next(bailed);
  }).run();
}

function launch() {
  async.forEachOfSeries(lookup, runCitgm, function done () {
    reporter.logger(log, modules);

    if (app.markdown) {
      reporter.markdown(log.bypass, modules);
    }
    
    if (app.tap) {
      // if tap is a string it should be a path to write output to
      // if not use `log.bypass` which is currently process.stdout.write
      // TODO check that we can write to that path, perhaps require a flag to overwrite
      var tap = (typeof app.tap === 'string') ? app.tap : log.bypass;
      reporter.tap(tap, modules);
    }

    process.exit(reporter.util.hasFailures(modules));
  });
}
