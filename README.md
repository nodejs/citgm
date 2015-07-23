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
bin/citgm async
```

You can identify the module to be tested using the same syntax supported by
the `npm install` CLI command

```
bin/citgm -v async@latest
bin/citgm -v http://github.com/jasnell/activitystrea.ms.git
```

Run an alternate test script
```
bin/citgm lodash known/lodash/test.js
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
