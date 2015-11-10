var test = require('tap').test;

var pass = require('../index.js');


test('This will always pass', function (t) {
  t.plan(1);
  t.ok(pass);
});
