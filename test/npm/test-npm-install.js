'use strict';
var os = require('os');
var path = require('path');
var fs = require('fs');

var test = require('tap').test;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var ncp = require('ncp');

var npmInstall = require('../../lib/npm/install');

var sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
var fixtures = path.join(__dirname, '..', 'fixtures');
var moduleFixtures = path.join(fixtures, 'omg-i-pass');
var moduleTemp = path.join(sandbox, 'omg-i-pass');
var badFixtures = path.join(fixtures, 'omg-bad-tree');
var badTemp = path.join(sandbox, 'omg-bad-tree');
var nodeGypFixtures = path.join(fixtures, 'omg-i-have-binding-gyp');
var nodeGypTemp = path.join(sandbox, 'omg-i-have-binding-gyp');
var fakeNodeGypJs = path.join(fixtures, 'fakenodegyp', 'fakenodegyp.js');

test('npm-install: setup', function (t) {
  t.plan(7);
  mkdirp(sandbox, function (err) {
    t.error(err);
    ncp(moduleFixtures, moduleTemp, function (e) {
      t.error(e);
      t.ok(fs.existsSync(path.join(moduleTemp, 'package.json')));
    });
    ncp(badFixtures, badTemp, function (e) {
      t.error(e);
      t.ok(fs.existsSync(path.join(badTemp, 'package.json')));
    });
    ncp(nodeGypFixtures, nodeGypTemp, function (e) {
      t.error(e);
      t.ok(fs.existsSync(path.join(nodeGypTemp, 'package.json')));
    });
  });
});

test('npm-install: basic module', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass'
    },
    meta: {},
    options: {
      npmLevel: 'silly'
    }
  };
  npmInstall(context, function (err) {
    t.error(err);
    t.end();
  });
});

test('npm-install: no package.json', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-fail'
    },
    meta: {},
    options: {
      npmLevel: 'silly'
    }
  };
  npmInstall(context, function (err) {
    t.equals(err && err.message, 'Install Failed');
    t.end();
  });
});

test('npm-install: timeout', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass'
    },
    meta: {},
    options: {
      npmLevel: 'silly',
      timeoutLength: 100
    }
  };
  npmInstall(context, function (err) {
    t.equals(err && err.message, 'Install Timed Out');
    t.end();
  });
});

test('npm-install: failed install', function (t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-bad-tree'
    },
    meta: {},
    options: {
      npmLevel: 'http'
    }
  };
  npmInstall(context, function (err) {
    t.equals(err && err.message, 'Install Failed');
    t.end();
  });
});

test('npm-install: verify-node-gyp-not-called passes if not called', function(t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass',
      verifyNodeGyp: true,
      verifyNodeGypNotCalled: true
    },
    meta: {},
    options: {
      npmLevel: 'silly'
    }
  };
  npmInstall(context, function (err) {
    t.error(err);
    t.end();
  });
});

test('npm-install: verify-node-gyp-not-called fails if called', function(t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-have-binding-gyp',
      verifyNodeGyp: true,
      verifyNodeGypNotCalled: true
    },
    meta: {},
    options: {
      npmLevel: 'silly'
    }
  };
  process.env['npm_config_node_gyp'] =  fakeNodeGypJs;
  npmInstall(context, function (err) {
    t.equals(err && err.message, 'node-gyp was called');
    t.end();
  });
});

test('npm-install: verify-node-gyp-called passes if called', function(t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-have-binding-gyp',
      verifyNodeGyp: true,
      verifyNodeGypCalled: true
    },
    meta: {},
    options: {
      npmLevel: 'silly'
    }
  };
  process.env['npm_config_node_gyp'] =  fakeNodeGypJs;
  npmInstall(context, function (err) {
    t.error(err);
    t.end();
  });
});

test('npm-install: verify-node-gyp-called fails if not called', function(t) {
  var context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass',
      verifyNodeGyp: true,
      verifyNodeGypCalled: true
    },
    meta: {},
    options: {
      npmLevel: 'silly'
    }
  };
  npmInstall(context, function (err) {
    t.equals(err && err.message, 'node-gyp was not called');
    t.end();
  });
});

test('npm-install: teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});
