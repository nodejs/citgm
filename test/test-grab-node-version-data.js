'use strict';

var rewire = require('rewire');
var EE = require('events');
var test = require('tap').test;

var grabNode = rewire('../lib/grab-node-version-data');

test('grab-node-version-data: setup', function (t) {
  grabNode.__set__('spawn', function (bin, args) {
    var stdout = new EE;
    process.nextTick(function () {
      stdout.emit('data', JSON.stringify({
        argsWere: [bin, args]
      }));
      stdout.emit('close');
    });
    return {stdout: stdout};
  });
  t.end();
});

test('grab-node-version-data: lower loglevel', function (t) {
  var emitted = [];
  var context = {
    emit: function () {
      emitted.push(Array.prototype.slice.call(arguments));
    },
    options: {
      level: 'info'
    }
  };
  var expectedEmitted = [];
  grabNode(context, function (err) {
    t.error(err);
    t.equals(emitted.length, 0, 'There should be zero log messages');
    t.same(emitted, expectedEmitted, 'The correct output was generated');
    t.end();
  });

});

test('grab-node-version-data: verbose', function (t) {
  var emitted = [];
  var context = {
    emit: function () {
      emitted.push(Array.prototype.slice.call(arguments));
    },
    options: {
      level: 'verbose'
    }
  };
  var expectedEmitted = [
    ['data', 'verbose', 'npm-install-versions', JSON.stringify({
      argsWere: ['node', ['-p', 'process.versions.execPath = process.execPath; JSON.stringify(process.versions)']]
    }, null, 4)],
    ['data', 'verbose', 'npm-test-versions', JSON.stringify({
      argsWere: ['node', ['-p', 'process.versions.execPath = process.execPath; JSON.stringify(process.versions)']]
    }, null, 4)]
  ];
  grabNode(context, function (err) {
    t.error(err);
    t.equals(emitted.length, 2, 'There should be two log messages');
    t.same(emitted, expectedEmitted, 'The correct output was generated');
    t.end();
  });
});

test('grab-node-version-data: silly', function (t) {
  var emitted = [];
  var context = {
    emit: function () {
      emitted.push(Array.prototype.slice.call(arguments));
    },
    options: {
      level: 'silly'
    }
  };
  var expectedEmitted = [
    ['data', 'verbose', 'npm-install-versions', JSON.stringify({
      argsWere: ['node', ['-p', 'process.versions.execPath = process.execPath; JSON.stringify(process.versions)']]
    }, null, 4)],
    ['data', 'verbose', 'npm-test-versions',JSON.stringify({
      argsWere: ['node', ['-p', 'process.versions.execPath = process.execPath; JSON.stringify(process.versions)']]
    }, null, 4)]
  ];
  grabNode(context, function (err) {
    t.error(err);
    t.equals(emitted.length, 2, 'There should be two log messages');
    t.same(emitted, expectedEmitted, 'The correct output was generated');
    t.end();
  });
});
