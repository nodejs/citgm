var EventEmitter = require('events').EventEmitter;
var util = require('util');

function RequestMock() {
  if (!(this instanceof RequestMock))
    return new RequestMock;
  EventEmitter.call(this);
}

util.inherits(RequestMock, EventEmitter);

RequestMock.prototype.pipe = function() {
  this.emit('error', new Error('I am broken'));
};

module.exports = RequestMock;
