## The Canary in the Goldmine

citgm is a simple tool for pulling down an arbitrary module
from npm and testing it using a specific version of the
node runtime.

[![Build Status](https://travis-ci.org/nodejs/citgm.svg?branch=master)](https://travis-ci.org/nodejs/citgm) [![dependencies Status](https://david-dm.org/nodejs/citgm/status.svg)](https://david-dm.org/nodejs/citgm) [![devDependencies Status](https://david-dm.org/nodejs/citgm/dev-status.svg)](https://david-dm.org/nodejs/citgm?type=dev)

The Node.js project uses citgm to smoketest our releases and controversial changes. The Jenkins job that utilizes citgm can be found [on our CI](https://ci.nodejs.org/view/Node.js-citgm/job/citgm-smoker/).

## Installation
```
npm install -g citgm
```

## Usage
```
citgm --help
```

(If citgm is installed globally, you can also `man citgm`)

```
Usage: citgm [options] <module>

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
  --tmpDir <path>             Directory to test modules in
```

### Examples:
  Test the latest underscore module:
    `citgm underscore@latest`

  Test a local module:
    `citgm ./my-module`

   Test using a tar.gz from Github:
    `citgm http://github.com/jasnell/activitystrea.ms/archive/master.tar.gz`

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

```
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
  -f, --fail-flaky            Ignore flaky flags. Do not ignore any failures.
  -u, --uid <uid>             Set the uid (posix only)
  -g, --gid <uid>             Set the gid (posix only)
  -a, --append                Turns on append results to file mode rather than replace
  -j, --parallel <number>     Run tests in parallel
  -J, --autoParallel          Run tests in parallel (automatically detect core count)
  --tmpDir <path>             Directory to test modules in
  --includeTags tag1 tag2     Only test modules from the lookup that contain a matching tag field
  --excludeTags tag1 tag2     Specify which tags to skip from the lookup (takes priority over includeTags)
```

When using a JSON config file, the properties need to be the same as the
longer-form CLI options. You can also use environment variables. For example,
`CITGM_TEST_PATH=$HOME/bin` is the same as `--test-path $HOME/bin`.

You can also test your own list of modules:

```
citgm-all -l ./path/to/my_lookup.json
```
For syntax, see [lookup.json](./lib/lookup.json), the available attributes are:

```
"npm": true                  Download the module from npm instead of github
"master": true               Use the master branch
"prefix": "v"                Specify the prefix used in the module version.
"flaky": true                Ignore failures
"skip": true                 Completely skip the module
"expectFail"                 Expect the module to fail, error if it passes
"repo": "https://github.com/pugjs/jade" - Use a different github repo
"skipAnsi": true             Strip ansi data from output stream of npm
"sha": "<git-commit-sha>"    Test against a specific commit
"envVar"                     Pass an environment variable before running
"install": ["--param1", "--param2"] - Array of extra command line parameters passed to 'npm install'
"maintainers": ["user1", "user2"] - List of module maintainers to be contacted with issues
"tags": ["tag1", "tag2"]     Specify which tags apply to the module
```

If you want to pass options to npm, eg `--registry`, you can usually define an
environment variable, eg `"npm_config_registry": "https://www.xyz.com"`.

## Multiple tests for single module

You can provide more than one configuration option for a module by using
`tests` attribute in [lookup.json](./lib/lookup.json). Entire entry without the
`test` attribute will be the default test. Each key of the `test` attribute is
an object that defines separate test. Keys of each test will be used to
overwrite values of the default test.

Special key `default-name` can be used to rename default test.

For example, this can be used to test both prebuilt and locally built addons:
```
"sample_module": {
  "prefix": "v",
  "flaky": true,
  "tests": {
    "default-name": "prebuilt",
    "built-locally": {
      "flaky": false,
      "install": ["--build-from-source"]
    }
  }
}
```

This defines two test for `sample_module`. Default one called "prebuilt" with:
```
{
  "prefix:": "v",
  "flaky": true
}
```
And "built-locally" with:
```
{
  "prefix": "v",
  "flaky": false,
  "install": ["--build-from-source"]
}
```

`citgm-all` will use both tests when running. Running `citgm sample_module` will
call the default test. You can select the test by adding `#test name` to module
name - `citgm sample_module#prebuilt` will run default test and
`citgm sample_module#build-locally` will use the "built-locally" test.

## Testing

You can run the test suite using npm

```bash
npm run test
```

This will run both a linter and a tap based unit test suite.

## Requirements for inclusion in Node.js Citgm runs

#### Hard Requirements

* Module source code must be on Github.
* Published versions must include a tag on Github
* The test process must be executable with only the commands
`npm install && npm test` using the tarball downloaded from the Github tag
mentioned above
* The tests pass on supported major release lines
* The maintainers of the module remain responsive when there are problems
* At least one module maintainer must be added to the lookup maintainers field

#### Soft Requirements

At least one of:
* The module must be actively used by the community
OR
* The module must be heavily depended on
OR
* The module must cover unique portions of our API
OR
* The module fits into a key category (e.g. Testing, Streams, Monitoring, etc.)
OR
* The module is under the Node.js foundation Github org
OR
* The module is identified as an important module by a Node.js Working Group

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
known npm specs (lodash for instance) with their github tarball alternatives.
The lookup mechanism is switched on using the `-l` or
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
