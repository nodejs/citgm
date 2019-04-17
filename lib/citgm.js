'use strict';

const { EventEmitter } = require('events');
const { promisify } = require('util');

const npa = require('npm-package-arg');
const BufferList = require('bl');
const which = promisify(require('which'));

const grabModuleData = require('./grab-module-data');
const grabProject = require('./grab-project');
const lookup = require('./lookup');
const packageManager = require('./package-manager');
const tempDirectory = require('./temp-directory');
const unpack = require('./unpack');

const windows = process.platform === 'win32';
exports.windows = windows;

async function findNode(context) {
  const resolved = await which('node');
  context.emit(
    'data',
    'verbose',
    `${context.module.name} using-node`,
    resolved
  );
}

async function findPackageManagers(context) {
  const { npm, yarn } = await packageManager.getPackageManagers();
  context.npmPath = npm;
  context.yarnPath = yarn;
}

function init(context) {
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

  async run() {
    this.emit('start', this.module.raw);
    let err = null;
    try {
      init(this);
      await findNode(this);
      await findPackageManagers(this);
      await tempDirectory.create(this);
      await grabModuleData(this);
      await lookup(this);
      await grabProject(this);
      await unpack(this);
      await packageManager.install(this);
      await packageManager.test(this);
    } catch (e) {
      err = e;
    }

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
      await tempDirectory.remove(this);
      this.emit('end', payload);
      this.cleanexit = true;
    }
  }

  async cleanup() {
    this.cleanexit = true;
    const payload = {
      name: this.module.name || this.module.raw,
      error: Error('Process Interrupted')
    };
    this.emit('fail', payload.error);
    await tempDirectory.remove(this);
    this.emit('end', payload);
  }
}

exports.Tester = Tester;
