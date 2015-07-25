var child = require('child_process');
var assert = require('assert');

console.log(process.cwd());
describe('It should not die', function() {
  it('should run the test for the module correctly', function(done) {
    this.timeout(60 * 1000); // increase the timeout
    var proc = child.spawn(
      'bin/citgm',
      ['./test/test-dir'],
      {stdio:[0,1,2]});
    proc.on('close', function(code) {
      assert(!code);
      done();
    });
  });
});

var server;
var http = require('http');
var fs = require('fs');
function runServer(hmac,done) {
  server = http.createServer(function(req,res) {
    var read = fs.createReadStream('./test/test-script.js');
    res.setHeader('Content-HMAC', hmac);
    read.pipe(res);
  });
  server.listen(8080, done);
}
function stopServer(done) {
  server.close(done);
}
function doTest(expected,done) {
  var proc = child.spawn(
    'bin/citgm',
    [
      '-k', 'testkey',
      './test/test-dir',
      'http://localhost:8080'
    ],
    {stdio:[0,1,2]});
  proc.on('close', function(code) {
    assert.equal(expected, code);
    done();
  });
}

describe('Remote Script with Valid HMAC', function() {
  this.timeout(60 * 1000); // increase the timeout
  var hmac_value = 'SHA256 21KF4Qv1AXkCbvdGz7Enp5WIwJxQ+S+70/DOiCcMCYY=';
  before(runServer.bind(null, hmac_value));
  after(stopServer);
  it('Should run the test script correctly', doTest.bind(null,0));
});

describe('Remote Script with Invalid HMAC', function() {
  var hmac_value = 'SHA256 21KF4Qv1AXkCbvdGz7Enp5WIwJxQ+S+70/DOiCcMCYZ=';
  before(runServer.bind(null, hmac_value));
  after(stopServer);
  it('Should fail to run the test script correctly', doTest.bind(null,1));
});
