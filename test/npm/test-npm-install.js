'use strict';
const os = require('os');
const path = require('path');
const fs = require('fs');

const test = require('tap').test;
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const ncp = require('ncp');

const npmInstall = require('../../lib/npm/install');

const sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());
const fixtures = path.join(__dirname, '..', 'fixtures');
const moduleFixtures = path.join(fixtures, 'omg-i-pass');
const moduleTemp = path.join(sandbox, 'omg-i-pass');
const extraParamFixtures = path.join(fixtures, 'omg-i-pass-with-install-param');
const extraParamTemp = path.join(sandbox, 'omg-i-pass-with-install-param');
const badFixtures = path.join(fixtures, 'omg-bad-tree');
const badTemp = path.join(sandbox, 'omg-bad-tree');
const nodeGypFixtures = path.join(fixtures, 'omg-i-have-binding-gyp');
const nodeGypTemp = path.join(sandbox, 'omg-i-have-binding-gyp');
const fakeNodeGypJs = path.join(fixtures, 'fakenodegyp', 'fakenodegyp.js');

test('npm-install: setup', function (t) {
  t.plan(9);
  mkdirp(sandbox, function (err) {
    t.error(err);
    ncp(moduleFixtures, moduleTemp, function (e) {
      t.error(e);
      t.ok(fs.existsSync(path.join(moduleTemp, 'package.json')));
    });
    ncp(extraParamFixtures, extraParamTemp, function (e) {
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
  const context = {
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

test('npm-install: extra install parameters', function (t) {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass-with-install-param',
      install: ['--extra-param']
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
  const context = {
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
  const context = {
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
  const context = {
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

  const expected = {
    testOutput: /^$/,
    testError: 'npm ERR! 404 Registry returned 404 for GET on'
    + ' https://registry.npmjs.org/THIS-WILL-FAIL'
  };
  npmInstall(context, function (err) {
    t.equals(err && err.message, 'Install Failed');
    t.match(context, expected, 'Install error reported');
    t.end();
  });
});

test('npm-install: verify-node-gyp:not called ok if not called', function(t) {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass',
      verifyNodeGyp: false
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

test('npm-install: verify-node-gyp:not called fails if called', function(t) {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-have-binding-gyp',
      verifyNodeGyp: false
    },
    meta: {},
    options: {
      npmLevel: 'silly'
    }
  };
  process.env['npm_config_node_gyp'] = fakeNodeGypJs;
  npmInstall(context, function (err) {
    t.equals(err && err.message, 'node-gyp was used to build module');
    t.end();
  });
});

test('npm-install: verify-node-gyp:called passes if called', function(t) {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-have-binding-gyp',
      verifyNodeGyp: true
    },
    meta: {},
    options: {
      npmLevel: 'silly'
    }
  };
  process.env['npm_config_node_gyp'] = fakeNodeGypJs;
  npmInstall(context, function (err) {
    t.error(err);
    t.end();
  });
});

test('npm-install: verify-node-gyp:called fails if not called', function(t) {
  const context = {
    emit: function() {},
    path: sandbox,
    module: {
      name: 'omg-i-pass',
      verifyNodeGyp: true
    },
    meta: {},
    options: {
      npmLevel: 'silly'
    }
  };
  npmInstall(context, function (err) {
    t.equals(err && err.message, 'node-gyp was not used to build module');
    t.end();
  });
});

test('npm-install: teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});
