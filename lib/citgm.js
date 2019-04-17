'use strict';

const { EventEmitter } = require('events');

const async = require('async');
const npa = require('npm-package-arg');
const BufferList = require('bl');
let which = require('which'); // Mocked in tests

const grabModuleData = require('./grab-module-data');
const grabProject = require('./grab-project');
const lookup = require('./lookup');
const packageManager = require('./package-manager');
const tempDirectory = require('./temp-directory');
const unpack = require('./unpack');

const windows = process.platform === 'win32';
exports.windows = windows;

function findNode(context, next) {
  which('node', (err, resolved) => {
    if (err) {
      next(err);
      return;
    }
    context.emit(
      'data',
      'verbose',
      `${context.module.name} using-node`,
      resolved
    );
    next(null, context);
  });
}

function findPackageManagers(context, next) {
  packageManager.getPackageManagers((err, res) => {
    if (err) {
      next(err);
      return;
    }

    context.npmPath = res.npm;
    context.yarnPath = res.yarn;

    next(null, context);
  });
}

function init(context, next) {
  if (!windows) {
    if (context.options.uid)
      context.emit(
        'data',
        'verbose',
        `${context.module.name} using-uid`,
        context.options.uid
      );
    if (context.options.gid)
      context.emit(
        'data',
        'verbose',
        `${context.module.name} using-gid`,
        context.options.gid
      );
  }
  context.emit(
    'data',
    'silly',
    `${context.module.name} init-detail`,
    context.module
  );
  next(null, context); // Inject the context
}

function sha1(mod) {
  const crypto = require('crypto');
  const shasum = crypto.createHash('sha1');
  shasum.update(mod);
  return shasum.digest('hex');
}

function extractDetail(mod) {
  const detail = npa(mod); // Will throw if mod is invalid
  detail.name = detail.name || `noname-${sha1(mod)}`;
  return detail;
}

/**
 * The Tester will emit specific events once it is run:
 *  - end = emitted when the test is complete
 *  - fail = emitted if the test fails for any reason
 *  - info = informational events (for debugging)
 *  - start = emitted when run is started
 **/
class Tester extends EventEmitter {
  constructor(mod, options) {
    super();
    this.module = extractDetail(mod);
    this.options = options;
    this.testOutput = new BufferList();
    this.testError = new BufferList();
    this.cleanexit = false;
  }

  run() {
    this.emit('start', this.module.raw);

    async.waterfall(
      [
        init.bind(null, this),
        findNode,
        findPackageManagers,
        tempDirectory.create,
        grabModuleData,
        lookup,
        grabProject,
        unpack,
        packageManager.install,
        packageManager.test
      ],
      (err) => {
        if (!this.cleanexit) {
          const payload = {
            name: this.module.name || this.module.raw,
            version: this.module.version,
            flaky: this.module.flaky,
            expectFail: this.module.expectFail
          };
          if (err && !payload.expectFail) {
            this.emit('fail', err);
            payload.error = err;
          } else if (!err && payload.expectFail) {
            this.emit('fail', 'this module should have failed');
            payload.error = 'this module should have failed';
          }
          if (this.testOutput !== '') {
            payload.testOutput += `${this.testOutput.toString()}\n`;
          }
          if (this.testError !== '') {
            payload.testOutput += `${this.testError.toString()}\n`;
          }
          tempDirectory.remove(this, () => {
            this.emit('end', payload);
            this.cleanexit = true;
          });
        }
      }
    );
  }

  cleanup() {
    this.cleanexit = true;
    const payload = {
      name: this.module.name || this.module.raw,
      error: Error('Process Interrupted')
    };
    this.emit('fail', payload.error);
    tempDirectory.remove(this, () => {
      this.emit('end', payload);
    });
  }
}

exports.Tester = Tester;
