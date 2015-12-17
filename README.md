## The Canary in the Goldmine

citgm is a simple tool for pulling down an arbitrary module
from npm and testing it using a specific version of the
node runtime.

Still a work in progress.

## Installation
```
npm install -g citgm
```

## Usage
```
bin/citgm --help
```

(If citgm is installed globally, you can also `man citgm`)

```
Usage: citgm [options] <module> [test]

Options:

  -h, --help           output usage information
  -V, --version        output the version number
  -v, --verbose        Verbose output
  -k, --hmac <key>     HMAC Key for Script Verification
  -l, --lookup [path]  Use the lookup table. Optional [path] for alternate
                       json file
  -d, --nodedir <path> Path to the node source to use when compiling native
                       addons
  -n, --no-color       Turns off colorized output
  -s, --su             Allow running the tool as root
  -u, --uid <uid>      Set the uid (posix only)
  -g, --gid <uid>      Set the gid (posix only)
```

The tool requires online access to the npm registry to run. If you want to
point to a private npm registry, then you'll need to set that up in your
npm config separately before running citgm.

By default, the tool will prevent users from running as root unless the
`-s` or `--su` CLI switch is set. If the tool is launched as root, it will
attempt to silently and automatically downgrade permissions. If it cannot
downgrade, it will print an error and exit the process.

The tool will also automatically check npm to see if there are updates
available. If a newer version has been published to npm, an info notice
will appear in the verbose output. If the `-v` or `--verbose` flag is not
set, the update notice will not be displayed.

## citgm-all

If you want to run all the test suites for all modules found in a lookup
table use citgm-all. It will automate the running of all tests and give
itemized results at the end. It has all the same options as citgm except
for the added markdown option which will print the results in markdown.

```
Usage: citgm-all [options]

Options:

  -h, --help             output usage information
  -V, --version          output the version number
  -v, --verbose [level]  Verbose output (silly, verbose, info, warn, error)
  -l, --lookup <path>    Use the lookup table provided at <path>
  -d, --nodedir <path>   Path to the node source to use when compiling native addons
  -n, --no-color         Turns off colorized output
  -s, --su               Allow running the tool as root.
  -m, --markdown         Output results in markdown
  -u, --uid <uid>        Set the uid (posix only)
  -g, --gid <uid>        Set the gid (posix only)
```

## Testing

You can run the test suite using npm

```bash
npm run test
```

This will run both a linter as well as a tap based unit test suite.

## Notes

You can identify the module to be tested using the same syntax supported by
the `npm install` CLI command

```
citgm activitystrea.ms@latest
citgm git+http://github.com/jasnell/activitystrea.ms
```

Quite a few modules published to npm do not have their tests included, so
we end up having to go directly to github. The most reliable approach is
pulling down a tar ball for a specific branch from github:

```
citgm https://github.com/caolan/async/archive/master.tar.gz
```

If a module does not support npm test or requires additional init or
teardown, you can run an alternative test script:

```
citgm https://github.com/lodash/lodash/archive/master.tar.gz known/lodash/test.js
```

The custom script can be pulled from a remote location... although, it's wise
to be very very careful when doing so as the script will run with whatever
permissions the citgm tool has (unless the `-u` and `-g` command line options
are set on Posix systems only)
```
citgm git+https://github.com/lodash/lodash https://gist.githubusercontent.com/jasnell/b274b80db9acb8fa5839/raw/c2df819d589d5a7a91d2d48b0e787b4dcebf6e66/test.js
```

If a Content-HMAC header is returned in the HTTP response for the script,
you can use the `-k` or `--hmac` command line option to pass in an HMAC key
that will be used to verify the script. If the HMAC does not verify using the
key, the script will not be run. The server MUST include a Content-HMAC
header in the response that provides the HMAC to check against
(see http://progrium.com/blog/2012/12/17/http-signatures-with-content-hmac/).

To simplify working with modules that we know need special handling, a lookup
table mechanism is provided. This mechanism allows citgm to substitute certain
known npm specs (lodash for instance) with their github tarball alternatives
and custom scripts. The lookup mechanism is switched on using the `-l` or
`--lookup` command line option.

```
citgm lodash@latest
```

There is a built in lookup.json in the lib directory that will be used by
default. If you want to use an alternative lookup.json file, pass in the
path:

```
citgm --lookup ../path/to/lookup.json lodash@latest
```

For the most part, the built in table should be sufficient for general use.

### Additional Notes:

* You may experience some wonkiness on Windows as the tool has not been fully
  tested on that platform.

* The tool uses the npm and node in the PATH. To change which node and
  npm the tool uses, change the PATH before launching citgm

* Running the tool in verbose mode (CLI switch `-v silly`) outputs significantly
  more detail (which is likely what we'll want in a fully automated run)

* If you've taken a look at the dependencies for this tool, you'll note that
  there are quite a few, some of which may not be strictly required. The
  reason for the large number of dependencies is that this *is* a testing
  tool, and many of the dependencies are broadly used. A large part of the
  reason for using them is to test that they'll work properly using the
  version of node being tested.

* PRs are welcome!

## Examples

### lodash
```
citgm lodash@latest
citgm https://github.com/lodash/lodash/archive/3.10.0.tar.gz known/lodash/test.js
```
### underscore
```
citgm underscore@latest
citgm https://github.com/jashkenas/underscore/archive/1.8.3.tar.gz
```
### request
```
citgm request@latest
citgm https://github.com/request/request/archive/v2.60.1.tar.gz
```
### commander
```
citgm commander@latest
citgm https://github.com/tj/commander.js/archive/v2.8.1.tar.gz
```
### express
```
citgm express@latest
citgm https://github.com/strongloop/express/archive/4.13.1.tar.gz
```
### debug
```
citgm debug
```
### chalk
```
citgm chalk@latest
citgm https://github.com/chalk/chalk/archive/v1.1.0.tar.gz
```
### q
```
citgm q@latest
citgm https://github.com/kriskowal/q/archive/v1.4.1.tar.gz
```
### colors
```
citgm colors@latest
citgm https://github.com/Marak/colors.js/archive/v1.1.2.tar.gz
```
### mkdirp
```
citgm mkdirp
```
### coffee-script
```
citgm coffee-script@latest
citgm https://github.com/jashkenas/coffeescript/archive/1.9.3.tar.gz
```
### through2
```
citgm through2@latest
citgm https://github.com/rvagg/through2/archive/v2.0.0.tar.gz
```
### bluebird
```
citgm bluebird@latest
citgm https://github.com/petkaantonov/bluebird/archive/v2.9.34.tar.gz
```
(currently not working)
### moment
```
citgm moment@latest
citgm https://github.com/moment/moment/archive/2.10.3.tar.gz
```
### optimist
```
citgm optimist
```
### yeoman-generator
```
citgm yeoman-generator@latest
citgm https://github.com/yeoman/generator/archive/v0.20.2.tar.gz
```
### glob
```
citgm glob@latest
citgm https://github.com/isaacs/node-glob/archive/v5.0.14.tar.gz
```
### gulp-util
```
citgm gulp-util@latest
citgm https://github.com/gulpjs/gulp-util/archive/v3.0.6.tar.gz
```
### minimist
```
citgm minimist@latest
citgm minimist
```
### cheerio
```
citgm cheerio@latest
citgm cheerio
```
### node-uuid
```
citgm node-uuid@latest
citgm node-uuid
```
### jade
```
citgm jade@latest
citgm https://github.com/jadejs/jade/archive/1.11.0.tar.gz
```
### redis
```
citgm redis@latest
citgm https://github.com/NodeRedis/node_redis/archive/v0.12.1.tar.gz
```
(currently not working due to lack of redis server)
### socket.io
```
citgm socket.io@latest
citgm https://github.com/Automattic/socket.io/archive/1.3.6.tar.gz
```
### fs-extra
```
citgm fs-extra@latest
citgm https://github.com/jprichardson/node-fs-extra/archive/0.22.1.tar.gz
```
### body-parser
```
citgm body-parser@latest
citgm https://github.com/expressjs/body-parser/archive/1.13.2.tar.gz
```
### uglify-js
```
citgm uglify-js@latest
citgm https://github.com/mishoo/UglifyJS2/archive/v2.4.24.tar.gz
```
### winston
```
citgm winston
```
### jquery
```
citgm jqery@latest
citgm https://github.com/jquery/jquery/archive/2.1.4.tar.gz
```
(currently not working)
### handlebars
```
citgm handlebars@latest
citgm https://github.com/wycats/handlebars.js/archive/v3.0.3.tar.gz
```
### through
```
citgm through
```
### rimraf
```
citgm rimraf@latest
citgm https://github.com/isaacs/rimraf/archive/v2.4.2.tar.gz
```
### semver
```
citgm semver
```
### yosay
```
citgm yosay@latest
citgm https://github.com/yeoman/yosay/archive/v1.0.5.tar.gz
```
### mime
```
citgm mime@latest
citgm https://github.com/broofa/node-mime/archive/v1.3.4.tar.gz
```
### mongodb
```
citgm mongodb@latest
citgm https://github.com/mongodb/node-mongodb-native/archive/V2.0.39.tar.gz
```

## Contributors

* James M Snell (@jasnell, jasnell@gmail.com / jasnell@us.ibm.com )
* Myles Borins  (@thealphanerd, myles.borins@gmail.com / mborins@us.ibm.com )
