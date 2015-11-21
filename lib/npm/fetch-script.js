// node modules
var path = require('path');
var fs = require('fs');

// npm modules
var uuid = require('node-uuid');

function fetchScript(context, script, next) {
  var url = require('url');
  var res = url.parse(String(script));
  if (res.protocol === 'http:' ||
      res.protocol === 'https:') {
    context.emit('data', 'silly', 'fetch-script-start', String(script));
    var dest = path.resolve(context.path, uuid.v4());
    var request = require('request');

    var hmac, check;

    var req = request(res.href).
      on('error', function(err) {
        next(err);
      }).
      on('end', function() {
        if (hmac) {
          var res = hmac.digest('base64');
          context.emit('data', 'silly', 'fetch-script-hmac', 'Calculated HMAC: ' + res);
          if (res != check) {
            next(Error('Error: Invalid HMAC!'));
            return;
          }
        }
        context.emit('data', 'silly', 'fetch-script-end', dest);
        next(null,dest);
      });

    if (context.options.hmac) {
      req.on('response', function(response) {
        check = response.headers['content-hmac'];
        if (check) {
          var parts = check.split(' ',2);
          hmac = require('crypto').createHmac(parts[0], context.options.hmac);
          check = parts[1];
          context.emit('data', 'silly', 'fetch-script-hmac', 'Content-HMAC: ' + check);
          context.emit('data', 'silly', 'fetch-script-hmac', 'Algorithm: ' + parts[0]);
        } else {
          context.emit('data', 'warn', 'fetch-script-warn', 'No Content-HMAC Provided');
        }
      });
      req.on('data', function(chunk) {
        if (hmac) hmac.update(chunk);
      });
    }

    req.pipe(fs.createWriteStream(dest)); // todo add verification
  } else {
    next(null,path.resolve(process.cwd(),String(script)));
  }
}

module.exports = fetchScript;
