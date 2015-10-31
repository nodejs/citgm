var path = require('path');

var test = require('tap').test;

var spawn = require('../lib/spawn');

var citgmPath = path.resolve(__dirname, '..', 'bin', 'citgm');

test('citgm: omg-i-pass', function (t) {
  t.plan(1);
  var proc = spawn(citgmPath, ['omg-i-pass']);
  proc.on('error', function(err) {
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', function (code) {
    t.ok(code === 0, 'omg-i-pass should pass and exit with a code of zero');
  });
});

test('citgm: omg-i-fail', function (t) {
  t.plan(1);
  var proc = spawn(citgmPath, ['omg-i-fail']);
  proc.on('error', function(err) {
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', function (code) {
    t.equal(code, 1, 'omg-i-fail should fail and exit with a code of one');
  });
});
