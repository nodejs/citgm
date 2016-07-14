'use strict';

var path = require('path');
var fs = require('fs');
var os = require('os');

var test = require('tap').test;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var rewire = require('rewire');

var fetch = rewire('../../lib/npm/script/fetch');
var RequestMock = require('../fixtures/request-mock');

var fixtures = path.join(__dirname, '..', 'fixtures');
var passing = path.join(fixtures, 'example-test-script-passing.sh');
var uriHttp = 'http://gist.githubusercontent.com/TheAlphaNerd/0bf45af05c7580c4d80f/raw/08e52f1a64410e91203c909a6a90255d48273b75/example-test-script-passing.sh';
var uriHttps = 'https://gist.githubusercontent.com/TheAlphaNerd/0bf45af05c7580c4d80f/raw/08e52f1a64410e91203c909a6a90255d48273b75/example-test-script-passing.sh';

var sandbox = path.join(os.tmpdir(), 'citgm-' + Date.now());

test('fetch: setup', function (t) {
  mkdirp(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});

test('fetch: given a file path', function (t) {
  var context = {
    path: sandbox,
    emit: function () {}
  };
  fetch(context, passing, function (err, _path)  {
    t.error(err);
    t.match(_path, context.path, 'the resolved path should be in the context path');
    fs.stat(_path, function (e, stats) {
      t.error(err);
      t.ok(stats.isFile(), 'The script should exist on the system');
      fs.unlinkSync(_path);
      t.end();
    });
  });
});

test('fetch: given a custom lookup table and relative path', function (t) {
  var context = {
    path: sandbox,
    emit: function () {},
    options: {
      lookup: path.join(fixtures, 'custom-lookup-script.json')
    }
  };
  fetch(context, './example-test-script-passing.sh', function (err, _path)  {
    t.error(err);
    t.match(_path, context.path, 'the resolved path should be in the context path');
    fs.stat(_path, function (e, stats) {
      t.error(err);
      t.ok(stats.isFile(), 'The script should exist on the system');
      fs.unlinkSync(_path);
      t.end();
    });
  });
});

test('fetch: given a uri with http', function (t) {
  var context = {
    path: sandbox,
    emit: function () {}
  };
  fetch(context, uriHttp, function (err, _path) {
    t.error(err);
    fs.stat(_path, function (e, stats) {
      t.error(err);
      t.ok(stats.isFile(), 'The script should exist on the system');
      fs.unlinkSync(_path);
      t.end();
    });
  });
});

test('fetch: given a uri with https', function (t) {
  var context = {
    path: sandbox,
    emit: function () {}
  };
  fetch(context, uriHttps, function (err, _path) {
    t.error(err);
    fs.stat(_path, function (e, stats) {
      t.error(err);
      t.ok(stats.isFile(), 'The script should exist on the system');
      fs.unlinkSync(_path);
      t.end();
    });
  });
});

test('fetch: properly handle errors from request', function (t) {
  var context = {
    path: sandbox,
    emit: function () {}
  };

  var request = fetch.__get__('request');
  var fs = fetch.__get__('fs');
  var createWriteStream = fs.createWriteStream;
  fs.createWriteStream = function () {};
  fetch.__set__('request', RequestMock);
  fetch(context, 'http://do-nothing.com', function (err) {
    t.equals(err && err.message, 'I am broken');
    fetch.__set__('request', request);
    fs.createWriteStream = createWriteStream;
    t.end();
  });
});

test('fetch: teardown', function (t) {
  rimraf(sandbox, function (err) {
    t.error(err);
    t.end();
  });
});
