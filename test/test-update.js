var test = require('tap').test;
var rewire = require('rewire');

var update = rewire('../lib/update');

var pkg = update.__get__('pkg');

pkg.version = '0.0.0';

test('update: /w callback', function (t) {
  var log = {
    warn: function (data) {
      t.equals(data, 'update-available');
      t.end();
    }
  };
  update(log);
});
