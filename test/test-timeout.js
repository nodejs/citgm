'use strict';

const os = require('os');
const path = require('path');
const test = require('tap').test;
const rewire = require('rewire');

const packageManager = require('../lib/package-manager');
const timeout = rewire('../lib/timeout');
const makeContext = require('./helpers/make-context');
const sandbox = path.join(os.tmpdir(), `citgm-${Date.now()}`);

let packageManagers;

test('timeout: setup', function (t) {
  t.plan(1);
  packageManager.getPackageManagers((e, res) => {
    packageManagers = res;
    t.error(e);
  });
});

test('timeout:', function (t) {
  const context = makeContext.npmContext('omg-i-pass', packageManagers,
    sandbox, {
      npmLevel: 'silly',
      timeoutLength: 100
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
  const finish = timeout(context, proc, next, 'Tap');
  setTimeout(() => {
    t.ok(context.module.flaky, 'Module is Flaky because timed out');
    t.equals(proc.killed, 1);
    t.equals(ret, null);
    t.ok(err instanceof Error, 'err should be an Error');
    // Finish should be idempotent
    const r = finish(1, 2);
    t.equals(r, undefined);
    t.equals(proc.killed, 1);
    t.end();
  }, 200);

});

test('timeout:', function (t) {
  const context = makeContext.npmContext('omg-i-pass', packageManagers,
    sandbox, {
      npmLevel: 'silly',
      timeoutLength: 100
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
  const finish = timeout(context, proc, next, 'Tap');
  const r = finish(sentinel2, sentinel3);
  t.equals(r, sentinel1);
  t.equals(proc.killed, 0);
  t.equals(err, sentinel2);
  t.equals(ret, sentinel3);
  setTimeout(() => {
    const r = finish(1, 2);
    t.ok(!context.module.flaky, 'Module is not Flaky finish called');
    t.equals(r, undefined);
    t.equals(proc.killed, 0);
    t.equals(err, sentinel2);
    t.equals(ret, sentinel3);
    t.end();
  }, 200);
});
