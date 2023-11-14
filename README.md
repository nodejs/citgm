## The Canary in the Goldmine

citgm is a simple tool for pulling down an arbitrary module from npm and testing
it using a specific version of the node runtime.

[![Build Status](https://github.com/nodejs/citgm/actions/workflows/nodejs.yml/badge.svg?branch=main)](https://github.com/nodejs/citgm/actions/workflows/nodejs.yml)

The Node.js project uses citgm to smoke test our releases and controversial
changes. The Jenkins job that utilizes citgm can be found
[on our CI](https://ci.nodejs.org/view/Node.js-citgm/job/citgm-smoker/).

## Installation

```
npm install -g citgm
```

## Usage

```
citgm --help
```

```
Usage: citgm [options] <module>

Options:

  -h, --help                  output usage information
  -V, --version               output the version number
  --config                    Path to a JSON config file
  -v, --verbose, --loglevel [level], Verbose output (silly, verbose, info, warn, error)
  -q, --npm-loglevel [level]  Verbose output (silent, error, warn, http, info, verbose, silly)
  -l, --lookup <path>         Use the lookup table provided at <path>
  -d, --nodedir <path>        Path to the node source to use when compiling native addons
  -p, --test-path <path>      Path to prepend to $PATH when running tests
  -n, --no-color              Turns off colorized output
  -s, --su                    Allow running the tool as root.
  -m, --markdown              Output results in markdown
  -t, --tap [path]            Output results in tap with optional file path
  --customTest <path>         Run a custom node test script instead of "npm test"
  -x, --junit [path]          Output results in junit xml with optional file path
  -o, --timeout <length>      Set timeout for npm install
  -c, --sha <commit-sha>      Install module from commit-sha, branch or tag
  -u, --uid <uid>             Set the uid (posix only)
  -g, --gid <uid>             Set the gid (posix only)
  -a, --append                Turns on append results to file mode rather than replace
  --tmpDir <path>             Directory to test modules in
```

### Examples:

Test the latest underscore module or a specific version:
`citgm underscore@latest` or `citgm underscore@1.3.0`

Test a local module: `citgm ./my-module`

Test using a tar.gz from Github:
`citgm http://github.com/jasnell/activitystrea.ms/archive/HEAD.tar.gz`

When using a JSON config file, the properties need to be the same as the
longer-form CLI options. You can also use environment variables. For example,
`CITGM_TEST_PATH=$HOME/bin` is the same as `--test-path $HOME/bin`.

The tool requires online access to the npm registry to run. If you want to point
to a private npm registry, then you'll need to set that up in your npm config
separately before running citgm.

By default, the tool will prevent users from running as root unless the `-s` or
`--su` CLI switch is set. If the tool is launched as root, it will attempt to
silently and automatically downgrade permissions. If it cannot downgrade, it
will print an error and exit the process.

## citgm-all

If you want to run all the test suites for all modules found in a lookup table
use citgm-all. It will automate the running of all tests and give itemized
results at the end. It has all the same options as citgm except for the added
markdown option which will print the results in markdown.

```
Usage: citgm-all [options]

Options:

  -h, --help                  output usage information
  -V, --version               output the version number
  --config                    Path to a JSON config file
  -v, --verbose, --loglevel [level], Verbose output (silly, verbose, info, warn, error)
  -q, --npm-loglevel [level]  Verbose output (silent, error, warn, http, info, verbose, silly)
  -l, --lookup <path>         Use the lookup table provided at <path>
  -d, --nodedir <path>        Path to the node source to use when compiling native addons
  -p, --test-path <path>      Path to prepend to $PATH when running tests
  -n, --no-color              Turns off colorized output
  -s, --su                    Allow running the tool as root.
  -m, --markdown              Output results in markdown
  -t, --tap [path]            Output results in tap with optional file path
  --customTest <path>         Run a custom node test script instead of "npm test"
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
                              Module names are automatically added as tags.
  -y, --yarn                  Install and test the project using yarn instead of npm
  --pnpm                      Install and test the project using pnpm instead of npm
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
"head": true                 Use the head of the default branch
"prefix": "v"                Specify the prefix used in the module version.
"flaky": true                Ignore failures
"skip": true                 Completely skip the module
"expectFail"                 Expect the module to fail, error if it passes
"repo": "https://github.com/pugjs/jade" - Use a different github repo
"stripAnsi": true            Strip ansi data from output stream of npm
"sha": "<git-commit-sha>"    Test against a specific commit
"envVar"                     Pass an environment variable before running
"install": ["install", "--param1", "--param2"] - Array of command line parameters passed to `npm` or `yarn` or `pnpm` as install arguments
"maintainers": ["user1", "user2"] - List of module maintainers to be contacted with issues
"scripts": ["script1", "script2"] - List of scripts from package.json to run instead of 'test'
"tags": ["tag1", "tag2"]     Specify which tags apply to the module
"useGitClone": true          Use a shallow git clone instead of downloading the module
"ignoreGitHead":             Ignore the gitHead field if it exists and fallback to using github tags
"yarn":                      Install and test the project using yarn instead of npm
"pnpm":                      Install and test the project using pnpm instead of npm
"timeout":                   Number of milliseconds before timeout. Applies separately to `install` and `test`
```

If you want to pass options to npm, eg `--registry`, you can usually define an
environment variable, eg `"npm_config_registry": "https://www.xyz.com"`.

## Testing

You can run the test suite using npm

```bash
npm run test
```

This will run both a linter and a tap based unit test suite.

## Requirements for inclusion in Node.js Citgm runs

If you want to submit a module to be run in the Node.js CI, see the
[requirements](./CONTRIBUTING.md#submitting-a-module-to-citgm).

## Notes

You can identify the module to be tested using the same syntax supported by the
`npm install` CLI command

```
citgm activitystrea.ms@latest
citgm git+http://github.com/jasnell/activitystrea.ms
```

Quite a few modules published to npm do not have their tests included, so we end
up having to go directly to github. The most reliable approach is pulling down a
tar ball for a specific branch from github:

```
citgm https://github.com/caolan/async/archive/HEAD.tar.gz
```

To simplify working with modules that we know need special handling, a lookup
table mechanism is provided. This mechanism allows citgm to substitute certain
known npm specs (lodash for instance) with their github tarball alternatives.
The lookup mechanism is switched on using the `-l` or `--lookup` command line
option.

```
citgm lodash@latest
```

There is a built in lookup.json in the lib directory that will be used by
default. If you want to use an alternative lookup.json file, pass in the path:

```
citgm --lookup ../path/to/lookup.json lodash@latest
```

For the most part, the built in table should be sufficient for general use.

You can run a custom test script instead of `npm test` CLI command:

```
citgm --customTest path/to/customTestScript
```

If you want to get code coverage results, your custom test script may look like:

```js
'use strict';

const { spawnSync } = require('child_process');
const path = require('path');
const packageName = require(path.join(process.cwd(), 'package.json')).name;

const coverageProcess = spawnSync('nyc', [
  '--reporter=json-summary',
  `--report-dir=${process.env.WORKSPACE}/${packageName}`,
  'npm',
  'test'
]);

const coverageSummary = require(path.join(
  process.env.WORKSPACE,
  packageName,
  'coverage-summary.json'
));
console.log(
  packageName,
  'total coverage result(%)',
  coverageSummary.total.lines.pct
);
```

You will have to globally install dependencies from the `customTestScript`, in
this case:

```
npm install -g nyc
```

### Additional Notes:

- You may experience some wonkiness on Windows as the tool has not been fully
  tested on that platform.

- The tool uses the npm and node in the PATH. To change which node and npm the
  tool uses, change the PATH before launching citgm

- Running the tool in verbose mode (CLI switch `-v silly`) outputs significantly
  more detail (which is likely what we'll want in a fully automated run)

- If you've taken a look at the dependencies for this tool, you'll note that
  there are quite a few, some of which may not be strictly required. The reason
  for the large number of dependencies is that this _is_ a testing tool, and
  many of the dependencies are broadly used. A large part of the reason for
  using them is to test that they'll work properly using the version of node
  being tested.

- PRs are welcome!

## CITGM team

<!-- ncu-team-sync.team(nodejs/citgm) -->

* [@BridgeAR](https://github.com/BridgeAR) - Ruben Bridgewater
* [@ljharb](https://github.com/ljharb) - Jordan Harband
* [@lukekarrys](https://github.com/lukekarrys) - Luke Karrys
* [@MylesBorins](https://github.com/MylesBorins) - Myles Borins
* [@richardlau](https://github.com/richardlau) - Richard Lau
* [@targos](https://github.com/targos) - Michaël Zasso

<!-- ncu-team-sync end -->

<details>
<summary>CITGM team emeritus</summary>

* [@al-k21](https://github.com/al-k21) - Oleksandr Kushchak
* [@bengl](https://github.com/bengl) - Bryan English
* [@bzoz](https://github.com/bzoz) - Bartosz Sosnowski
* [@gdams](https://github.com/gdams) - George Adams
* [@gibfahn](https://github.com/gibfahn) - Gibson Fahnestock
* [@jasnell](https://github.com/jasnell) - James M Snell

</details>

## Contributors

- as listed in <https://github.com/nodejs/citgm/blob/HEAD/AUTHORS>
