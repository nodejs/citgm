import { tmpdir } from 'os';
import { join } from 'path';

import tap from 'tap';

import { getPackageManagers } from '../lib/package-manager/index.js';
import { timeout } from '../lib/timeout.js';

import { npmContext } from './helpers/make-context.js';

const { test } = tap;

const sandbox = join(tmpdir(), `citgm-${Date.now()}-test-timeout`);

let packageManagers;

test('timeout: setup', async () => {
  packageManagers = await getPackageManagers();
});

test('timeout:', (t) => {
  t.plan(6);
  const context = npmContext('omg-i-pass', packageManagers, sandbox, {
    npmLevel: 'silly',
    timeout: 100
  });
  const proc = {
    kill() {
      this.killed++;
    },
    killed: 0
  };
  let err;
  let ret;
  const next = (e, r) => {
    err = e;
    ret = r;
  };
  const finish = timeout('npm', context, proc, next, 'Tap');
  setTimeout(() => {
    t.notOk(context.module.flaky, 'Time out should not mark module flaky');
    t.equal(proc.killed, 1);
    t.equal(ret, null);
    t.ok(err instanceof Error, 'err should be an Error');
    // Finish should be idempotent
    const r = finish(1, 2);
    t.equal(r, undefined);
    t.equal(proc.killed, 1);
    t.end();
  }, 200);
});

test('timeout:', (t) => {
  t.plan(9);
  const context = npmContext('omg-i-pass', packageManagers, sandbox, {
    npmLevel: 'silly',
    timeout: 100
  });
  const proc = {
    kill() {
      this.killed++;
    },
    killed: 0
  };
  let err;
  let ret;
  const sentinel1 = { 1: true };
  const sentinel2 = { 2: true };
  const sentinel3 = { 3: true };
  const next = (e, r) => {
    err = e;
    ret = r;
    return sentinel1;
  };
  const finish = timeout('npm', context, proc, next, 'Tap');
  const r = finish(sentinel2, sentinel3);
  t.equal(r, sentinel1);
  t.equal(proc.killed, 0);
  t.equal(err, sentinel2);
  t.equal(ret, sentinel3);
  setTimeout(() => {
    const r = finish(1, 2);
    t.notOk(context.module.flaky, 'Module is not Flaky finish called');
    t.equal(r, undefined);
    t.equal(proc.killed, 0);
    t.equal(err, sentinel2);
    t.equal(ret, sentinel3);
    t.end();
  }, 200);
});
