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

(If citgm is installed globally, you can also `man citgm` and
`man citgm-dockerify`)

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

## Notes

You can identify the module to be tested using the same syntax supported by
the `npm install` CLI command

```
bin/citgm -v activitystrea.ms@latest
bin/citgm -v git+http://github.com/jasnell/activitystrea.ms
```

Quite a few modules published to npm do not have their tests included, so
we end up having to go directly to github. The most reliable approach is
pulling down a tar ball for a specific branch from github:

```
bin/citgm -v https://github.com/caolan/async/archive/master.tar.gz
```

If a module does not support npm test or requires additional init or
teardown, you can run an alternative test script:

```
bin/citgm -v https://github.com/lodash/lodash/archive/master.tar.gz known/lodash/test.js
```

The custom script can be pulled from a remote location... although, it's wise
to be very very careful when doing so as the script will run with whatever
permissions the citgm tool has (unless the `-u` and `-g` command line options
are set on Posix systems only)
```
bin/citgm -v git+https://github.com/lodash/lodash https://gist.githubusercontent.com/jasnell/b274b80db9acb8fa5839/raw/c2df819d589d5a7a91d2d48b0e787b4dcebf6e66/test.js
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
bin/citgm -lv lodash@latest
```

There is a built in lookup.json in the lib directory that will be used by
default. If you want to use an alternative lookup.json file, pass in the
path:

```
bin/citgm -v --lookup ../path/to/lookup.json lodash@latest
```

For the most part, the built in table should be sufficient for general use.

### Using Docker

You can optionally create a Docker image for running specific citgm tests
using the `citgm-dockerify` tool.

```
Usage: citgm-dockerify [options] <image> <module> [test]

Generates a Docker image that can be used to run citgm for a specific module

Options:

  -h, --help           output usage information
  -V, --version        output the version number
  -t, --tag <tag>      Docker image tag
  -r, --run            Run the docker image immediately after build
  -v, --verbose        Verbose output
  -k, --hmac <key>     HMAC Key for Script Verification
  -l, --lookup [path]  Use the lookup table. Optional [path] for alternate json
                       file
  -d, --nodedir        Create the docker image with a /nodedir volume.
                       The workding directory MUST contain a nodedir
                       directory containing the node source image to use.
                       This must be located in the working directory in
                       or docker will refuse to copy it.
  -c, --citgmdir <path> By default, the docker image will install citgm from
                        npm. Use this to tell the image to install from a host
                        volume.
  -n, --no-color       Turns off colorized output
  -s, --su             Allow running the tool as root
  -u, --uid <uid>      Set the uid (posix only)
  -g, --gid <uid>      Set the gid (posix only)
  -d, --docker <name>  Alternate docker binary name
```

For example:

```
citgm-dockerify -t underscore -lv iojs@latest underscore
```

If successful, this will create the `citgm-underscore` docker image, which
can then be run using:

```
docker run citgm-underscore
```

You can automatically run the docker image after creating using the `-r`
command line switch.

Note: because of some weirdness in the way docker establishes the base
cwd when building an image, it's best to run `citgm-dockerify` from an
empty directory. The tool will generate the Dockerfile and artifacts it
needs, build the image, then delete the temporary files.

Also, there's an issue with using the docker image with tests in the lookup
JSON file that use custom scripts (i.e. lodash). Specifically, using the
lookup table will not currently work. If you want to dockerify a test using
a custom script, pass it in explicitly and do not rely on the lookup table
to identify the custom script for you.

### Additional Notes:

* You may experience some wonkiness on Windows as I have not fully
  tested the tool on that platform.

* The tool uses the npm and node in the PATH. To change which node and
  npm the tool uses, change the PATH before launching citgm

* Running the tool in verbose mode (CLI switch `-v`) outputs significantly
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
citgm -lv lodash@latest
citgm -v https://github.com/lodash/lodash/archive/3.10.0.tar.gz known/lodash/test.js
```
### underscore
```
citgm -lv underscore@latest
citgm -v https://github.com/jashkenas/underscore/archive/1.8.3.tar.gz
```
### request
```
citgm -lv request@latest
citgm -v https://github.com/request/request/archive/v2.60.1.tar.gz
```
### commander
```
citgm -lv commander@latest
citgm -v https://github.com/tj/commander.js/archive/v2.8.1.tar.gz
```
### express
```
citgm -lv express@latest
citgm -v https://github.com/strongloop/express/archive/4.13.1.tar.gz
```
### debug
```
citgm -v debug
```
### chalk
```
citgm -lv chalk@latest
citgm -v https://github.com/chalk/chalk/archive/v1.1.0.tar.gz
```
### q
```
citgm -lv q@latest
citgm -v https://github.com/kriskowal/q/archive/v1.4.1.tar.gz
```
### colors
```
citgm -lv colors@latest
citgm -v https://github.com/Marak/colors.js/archive/v1.1.2.tar.gz
```
### mkdirp
```
citgm -v mkdirp
```
### coffee-script
```
citgm -lv coffee-script@latest
citgm -v https://github.com/jashkenas/coffeescript/archive/1.9.3.tar.gz
```
### through2
```
citgm -lv through2@latest
citgm -v https://github.com/rvagg/through2/archive/v2.0.0.tar.gz
```
### bluebird
```
citgm -lv bluebird@latest
citgm -v https://github.com/petkaantonov/bluebird/archive/v2.9.34.tar.gz
```
(currently not working)
### moment
```
citgm -lv moment@latest
citgm -v https://github.com/moment/moment/archive/2.10.3.tar.gz
```
### optimist
```
citgm -v optimist
```
### yeoman-generator
```
citgm -lv yeoman-generator@latest
citgm -v https://github.com/yeoman/generator/archive/v0.20.2.tar.gz
```
### glob
```
citgm -lv glob@latest
citgm -v https://github.com/isaacs/node-glob/archive/v5.0.14.tar.gz
```
### gulp-util
```
citgm -lv gulp-util@latest
citgm -v https://github.com/gulpjs/gulp-util/archive/v3.0.6.tar.gz
```
### minimist
```
citgm -lv minimist@latest
citgm -v minimist
```
### cheerio
```
citgm -lv cheerio@latest
citgm -v cheerio
```
### node-uuid
```
citgm -lv node-uuid@latest
citgm -v node-uuid
```
### jade
```
citgm -lv jade@latest
citgm -v https://github.com/jadejs/jade/archive/1.11.0.tar.gz
```
### redis
```
citgm -lv redis@latest
citgm -v https://github.com/NodeRedis/node_redis/archive/v0.12.1.tar.gz
```
(currently not working due to lack of redis server)
### socket.io
```
citgm -lv socket.io@latest
citgm -v https://github.com/Automattic/socket.io/archive/1.3.6.tar.gz
```
### fs-extra
```
citgm -lv fs-extra@latest
citgm -v https://github.com/jprichardson/node-fs-extra/archive/0.22.1.tar.gz
```
### body-parser
```
citgm -lv body-parser@latest
citgm -v https://github.com/expressjs/body-parser/archive/1.13.2.tar.gz
```
### uglify-js
```
citgm -lv uglify-js@latest
citgm -v https://github.com/mishoo/UglifyJS2/archive/v2.4.24.tar.gz
```
### winston
```
citgm -v winston
```
### jquery
```
citgm -lv jqery@latest
citgm -v https://github.com/jquery/jquery/archive/2.1.4.tar.gz
```
(currently not working)
### handlebars
```
citgm -lv handlebars@latest
citgm -v https://github.com/wycats/handlebars.js/archive/v3.0.3.tar.gz
```
### through
```
citgm -v through
```
### rimraf
```
citgm -lv rimraf@latest
citgm -v https://github.com/isaacs/rimraf/archive/v2.4.2.tar.gz
```
### semver
```
citgm -v semver
```
### yosay
```
citgm -lv yosay@latest
citgm -v https://github.com/yeoman/yosay/archive/v1.0.5.tar.gz
```
### mime
```
citgm -lv mime@latest
citgm -v https://github.com/broofa/node-mime/archive/v1.3.4.tar.gz
```
### mongodb
```
citgm -lv mongodb@latest
citgm -v https://github.com/mongodb/node-mongodb-native/archive/V2.0.39.tar.gz
```

## Contributors

* James M Snell (@jasnell, jasnell@gmail.com / jasnell@us.ibm.com )
