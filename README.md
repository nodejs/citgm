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
Usage: citgm [options] <module>

Options:

  -h, --help                 output usage information
  -V, --version              output the version number
  -v, --verbose [level]      Verbose output (silly, verbose, info, warn, error)
  -q, --npm-loglevel [level]  Verbose output (silent, error, warn, http, info, verbose, silly)
  -l, --lookup <path>        Use the lookup table provided at <path>
  -d, --nodedir <path>       Path to the node source to use when compiling native addons
  -n, --no-color             Turns off colorized output
  -s, --su                   Allow running the tool as root.
  -u, --uid <uid>            Set the uid (posix only)
  -g, --gid <uid>            Set the gid (posix only)
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

  -h, --help                 output usage information
  -V, --version              output the version number
  -v, --verbose [level]      Verbose output (silly, verbose, info, warn, error)
  -q, --npm-loglevel [level]  Verbose output (silent, error, warn, http, info, verbose, silly)
  -l, --lookup <path>        Use the lookup table provided at <path>
  -d, --nodedir <path>       Path to the node source to use when compiling native addons
  -n, --no-color             Turns off colorized output
  -s, --su                   Allow running the tool as root.
  -m, --markdown             Output results in markdown
  -u, --uid <uid>            Set the uid (posix only)
  -g, --gid <uid>            Set the gid (posix only)
```

You can also test your own list of modules:

```
citgm-all -l ./path/to/my_lookup.json
```
For syntax, see [lookup.json](./lib/lookup.json), the available attributes are:

```
"replace": true              Download module from github repo in package.json
"master": true               Use the master branch
"prefix": "v"                Specify the prefix used in the module version.
"flaky": true                Ignore failures
"skip": true                 Completely skip the module
"repo": "https://github.com/pugjs/jade" - Use a different github repo
```
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

* James M Snell (@jasnell, jasnell@gmail.com / jasnell@us.ibm.com )
* Myles Borins  (@thealphanerd, myles.borins@gmail.com / mborins@us.ibm.com )
