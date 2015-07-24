var child = require('child_process');
var assert = require('assert');

console.log(process.cwd());
describe('It should not die', function() {
  it('should just work', function(done) {
    this.timeout(60 * 1000); // increase the timeout
    var proc = child.spawn(
      'bin/citgm',
      ['http://github.com/lodash/lodash/archive/master.tar.gz', 'known/lodash/test.js'],
      {stdio:[0,1,2]});
    proc.on('close', function(code) {
      assert(!code);
      done();
    });
  });
});
