## The Canary in the Goldmine

citgm is a simple tool for pulling down an arbitrary module
from npm and testing it using a specific version of the
node runtime.

[![Build Status](https://travis-ci.org/nodejs/citgm.svg?branch=master)](https://travis-ci.org/nodejs/citgm)

The Node.js project uses citgm to smoketest our releases and controversial changes. The Jenkins job that utilizes citgm can be found [on our CI](https://ci.nodejs.org/view/Node.js-citgm/job/citgm-smoker/).

## Installation
```
npm install -g citgm
```

## Usage
```
bin/citgm --help
```

(If citgm is installed globally, you can also `man citgm`)

```bash
Usage: citgm [options] <module> [script]

Options:

  -h, --help                  output usage information
  -V, --version               output the version number
  --config                    Path to a JSON config file
  -v, --verbose [level]       Verbose output (silly, verbose, info, warn, error)
  -q, --npm-loglevel [level]  Verbose output (silent, error, warn, http, info, verbose, silly)
  -l, --lookup <path>         Use the lookup table provided at <path>
  -d, --nodedir <path>        Path to the node source to use when compiling native addons
  -p, --test-path <path>      Path to prepend to $PATH when running tests
  -n, --no-color              Turns off colorized output
  -s, --su                    Allow running the tool as root.
  -m, --markdown              Output results in markdown
  -t, --tap [path]            Output results in tap with optional file path
  -x, --junit [path]          Output results in junit xml with optional file path
  -o, --timeout <length>      Set timeout for npm install
  -c, --sha <commit-sha>      Install module from commit-sha
  -u, --uid <uid>             Set the uid (posix only)
  -g, --gid <uid>             Set the gid (posix only)
  -a, --append                Turns on append results to file mode rather than replace
```

When using a JSON config file, the properties need to be the same as the
longer-form CLI options. You can also use environment variables. For example,
`CITGM_TEST_PATH=$HOME/bin` is the same as `--test-path $HOME/bin`.

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

```bash
Usage: citgm-all [options]

Options:

  -h, --help                  output usage information
  -V, --version               output the version number
  --config                    Path to a JSON config file
  -v, --verbose [level]       Verbose output (silly, verbose, info, warn, error)
  -q, --npm-loglevel [level]  Verbose output (silent, error, warn, http, info, verbose, silly)
  -l, --lookup <path>         Use the lookup table provided at <path>
  -d, --nodedir <path>        Path to the node source to use when compiling native addons
  -p, --test-path <path>      Path to prepend to $PATH when running tests
  -n, --no-color              Turns off colorized output
  -s, --su                    Allow running the tool as root.
  -m, --markdown              Output results in markdown
  -t, --tap [path]            Output results in tap with optional file path
  -x, --junit [path]          Output results in junit xml with optional file path
  -o, --timeout <length>      Set timeout for npm install
  -f, --fail-flaky            Ignore flaky flags. Don't ignore any failures.
  -u, --uid <uid>             Set the uid (posix only)
  -g, --gid <uid>             Set the gid (posix only)
  -a, --append                Turns on append results to file mode rather than replace
```

When using a JSON config file, the properties need to be the same as the
longer-form CLI options. You can also use environment variables. For example,
`CITGM_TEST_PATH=$HOME/bin` is the same as `--test-path $HOME/bin`.

You can also test your own list of modules:

```
citgm-all -l ./path/to/my_lookup.json
```
For syntax, see [lookup.json](./lib/lookup.json), the available attributes are:

  * `"replace": true` - Download module from github repo in package.json
  * `"master": true` - Use the master branch
  * `"prefix": "v"` - Specify the prefix used in the module version.
  * `"flaky": true` - Ignore failures
  * `"skip": true` - Completely skip the module
  * `"repo": "https://github.com/pugjs/jade"` - Use a different github repo
  * `"skipAnsi": true` - Strip ansi data from output stream of npm
  * `"script": /path/to/script | https://url/to/script` - Use a custom test script
  * `"sha": "<git-commit-sha>"` - Test against a specific commit
  * `"test-name": "name"` - Custom name for test case
  * `"verify-node-gyp-called": true` - Asserts that `npm` called `node-gyp` with either
  `build` or `rebuild`
  * `"vertify-node-gyp-not-called": true` - Asserts that `npm` did not call `node-gyp`
  * `"envVar": { "var": "value" }` - Pass an environment variable before running
  * `"test-command"` - Use custom test command:
```javascript
"test-command": {
  "default": "./node_modules/.bin/nodeunit test",
  "win32": "node_modules\\\\.bin\\\\nodeunit test"
}
```

If you want to pass options to npm, eg `--registry`, you can usually define an
environment variable, eg `"npm_config_registry": "https://www.xyz.com"`.

## Testing

You can run the test suite using npm

```bash
npm run test
```

This will run both a linter and a tap based unit test suite.

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

## Contributors

* as listed in <https://github.com/nodejs/citgm/blob/master/AUTHORS>
