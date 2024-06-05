import { EventEmitter } from 'events';

import BufferList from 'bl';
import which from 'which';

import { grabModuleData } from './grab-module-data.js';
import { grabProject } from './grab-project.js';
import { lookup } from './lookup.js';
import {
  getPackageManagers,
  pkgInstall,
  pkgTest
} from './package-manager/index.js';
import * as tempDirectory from './temp-directory.js';
import { unpack } from './unpack.js';
import { parsePackageArg } from './utils.js';

export const windows = process.platform === 'win32';

async function findNode(context) {
  const resolved = await which('node');
  context.emit(
    'data',
    'verbose',
    `${context.module.name} using-node`,
    resolved
  );
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

/**
 * The Tester will emit specific events once it is run:
 *  - end = emitted when the test is complete
 *  - fail = emitted if the test fails for any reason
 *  - info = informational events (for debugging)
 *  - start = emitted when run is started
 **/
export class Tester extends EventEmitter {
  constructor(mod, options) {
    super();
    this.module = parsePackageArg(mod);
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

      const { npm, yarn, pnpm } = await getPackageManagers();
      this.npmPath = npm;
      this.yarnPath = yarn;
      this.pnpmPath = pnpm;

      await tempDirectory.create(this);
      await grabModuleData(this);
      await lookup(this);
      await grabProject(this);
      await unpack(this);
      await pkgInstall(this);
      await pkgTest(this);
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

      if (this.options.sha) payload.sha = this.module.sha;

      if (err) {
        if (!payload.expectFail) {
          this.emit('fail', err);
          payload.error = err;
        }
      } else if (payload.expectFail) {
        this.emit('fail', 'this module should have failed');
        payload.error = 'this module should have failed';
      }
      if (this.testOutput !== '') {
        payload.testOutput += `${this.testOutput.toString()}\n`;
      }
      if (this.testError !== '') {
        payload.testOutput += `${this.testError.toString()}\n`;
      }
      try {
        await tempDirectory.remove(this);
      } catch (err) {
        this.emit('data', 'error', `${this.module.name} cleanup`, err);
      }
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
