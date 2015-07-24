## The Canary in the Goldmine

citgm is a simple tool for pulling down an arbitrary module
from npm and testing it using a specific version of the
node runtime.

Still a work in progress

Show help
```
bin/citgm --help
```

Run the default npm tests
```
bin/citgm [module-name]
```

You can identify the module to be tested using the same syntax supported by
the `npm install` CLI command

```
bin/citgm -v activitystrea.ms
bin/citgm -v http://github.com/jasnell/activitystrea.ms.git
```

Quite a few modules published to npm do not have their tests included, so
we end up having to go directly to github ...

```
bin/citgm -v https://github.com/caolan/async/archive/master.tar.gz
```

Run an alternate test script (lodash does not currently support npm test
and does not publish it's tests to npm, so we need to grab it directly
from github and use a custom test script)

using the git url:
```
bin/citgm -v git+https://github.com/lodash/lodash known/lodash/test.js
```
or, using a tar ball:
```
bin/citgm -v https://github.com/lodash/lodash/archive/master.tar.gz known/lodash/test.js
```

The script can be pulled from a remote location... although, it's wise to
be very very careful when doing so as the script will run with whatever
permissions the citgm tool has:
```
bin/citgm -v git+https://github.com/lodash/lodash https://gist.githubusercontent.com/jasnell/b274b80db9acb8fa5839/raw/c2df819d589d5a7a91d2d48b0e787b4dcebf6e66/test.js
```

The tool is published to npm and can be installed globally:
```
npm install -g citgm
```

## Notes:

* On posix systems, you can specify the uid and gid the tool will use to
  run npm, node and the test scripts using the `-u` and `-g` arguments.

* The tool uses the npm and node in the PATH. To change which node and
  npm the tool uses, change the PATH before launching citgm

* Running the tool in verbose mode (CLI switch `-v`) outputs significantly
  more detail (which is likely what we'll want in a fully automated run)

## Tests

### lodash
```
citgm -v https://github.com/lodash/lodash/archive/3.10.0.tar.gz known/lodash/test.js
```
### underscore
```
citgm -v https://github.com/jashkenas/underscore/archive/1.8.3.tar.gz
```
### request
```
citgm -v https://github.com/request/request/archive/v2.60.1.tar.gz
```
### commander
```
citgm -v https://github.com/tj/commander.js/archive/v2.8.1.tar.gz
```
### express
```
citgm -v https://github.com/strongloop/express/archive/4.13.1.tar.gz
```
### debug
```
citgm -v debug
```
### chalk
```
citgm -v https://github.com/chalk/chalk/archive/v1.1.0.tar.gz
```
### q
```
citgm -v https://github.com/kriskowal/q/archive/v1.4.1.tar.gz
```
### colors
```
citgm -v https://github.com/Marak/colors.js/archive/v1.1.2.tar.gz
```
### mkdirp
```
citgm -v mkdirp
```
### coffee-script
```
citgm -v https://github.com/jashkenas/coffeescript/archive/1.9.3.tar.gz
```
### through2
```
citgm -v https://github.com/rvagg/through2/archive/v2.0.0.tar.gz
```
### bluebird
```
citgm -v https://github.com/petkaantonov/bluebird/archive/v2.9.34.tar.gz
```
(currently not working)
### moment
```
citgm -v https://github.com/moment/moment/archive/2.10.3.tar.gz
```
### optimist
```
citgm -v optimist
```
### yeoman-generator
```
citgm -v https://github.com/yeoman/generator/archive/v0.20.2.tar.gz
```
### glob
```
citgm -v https://github.com/isaacs/node-glob/archive/v5.0.14.tar.gz
```
### gulp-util
```
citgm -v https://github.com/gulpjs/gulp-util/archive/v3.0.6.tar.gz
```
### minimist
```
citgm -v minimist
```
### cheerio
```
citgm -v cheerio
```
### node-uuid
```
citgm -v node-uuid
```
### jade
```
citgm -v https://github.com/jadejs/jade/archive/1.11.0.tar.gz
```
### redis
```
citgm -v https://github.com/NodeRedis/node_redis/archive/v0.12.1.tar.gz
```
(currently not working due to lack of redis server)
### socket.io
```
citgm -v https://github.com/Automattic/socket.io/archive/1.3.6.tar.gz
```
### fs-extra
```
citgm -v https://github.com/jprichardson/node-fs-extra/archive/0.22.1.tar.gz
```
### body-parser
```
citgm -v https://github.com/expressjs/body-parser/archive/1.13.2.tar.gz
```
### uglify-js
```
citgm -v https://github.com/mishoo/UglifyJS2/archive/v2.4.24.tar.gz
```
### winston
```
citgm -v winston
```
### jquery
```
citgm -v https://github.com/jquery/jquery/archive/2.1.4.tar.gz
```
(currently not working)
### handlebars
```
citgm -v https://github.com/wycats/handlebars.js/archive/v3.0.3.tar.gz
```
### through
```
citgm -v through
```
### rimraf
```
citgm -v https://github.com/isaacs/rimraf/archive/v2.4.2.tar.gz
```
### semver
```
citgm -v semver
```
### yosay
```
citgm -v https://github.com/yeoman/yosay/archive/v1.0.5.tar.gz
```
### mime
```
citgm -v https://github.com/broofa/node-mime/archive/v1.3.4.tar.gz
```
### mongodb
```
citgm -v https://github.com/mongodb/node-mongodb-native/archive/V2.0.39.tar.gz
```
