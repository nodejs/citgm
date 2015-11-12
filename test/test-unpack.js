'use strict';

var fs = require('fs');
var path = require('path');

var test = require('tap').test;

// TODO we could argue that tempDirectory should not be in here
// TODO it could make it not so unit
// TODO it is a super helpful abstraction though

var tempDirectory = require('../lib/temp-directory');
var unpack = require('../lib/unpack');

test('unpack: no unpack', function (t) {
  var context = {
    unpack: null,
    emit: function () {}
  };
  
  unpack(context, function (err) {
    t.deepEquals(err, new Error('Nothing to unpack... Ending'), 'it should error out');
    t.done();
  });
});

test('unpack: invalid unpack', function (t) {
  var context = {
    unpack: './test/fixtures/omg-i-fail.tar.gz',
    emit: function () {}
  };
  
  unpack(context, function (err) {
    t.deepEquals(err, new Error('Nothing to unpack... Ending'), 'it should error out');
    t.done();
  });
});

test('unpack: invalid unpack', function (t) {
  var context = {
    module: {
      name: 'omg-i-pass'
    },
    unpack: './test/fixtures/omg-i-pass.tar.gz',
    emit: function () {}
  };

  // FIXME I am not super convinced that the correct tar ball is being deflated
  // FIXME There is a possibility that the npm cache is trumping this 

  tempDirectory.create(context, function (e) {
    t.error(e);
    unpack(context, function (err) {
      t.error(err);
      fs.stat(path.join(context.path, 'omg-i-pass'), function (erro, stats) {
        t.error(erro);
        t.ok(stats.isDirectory(), 'the untarred result should be a directory');
        tempDirectory.remove(context, function (error) {
          t.error(error);
          t.done();
        });
      });
    });
  });
});
