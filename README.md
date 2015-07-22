## The Canary in the Goldmine

citgm is a simple tool for pulling down an arbitrary module
from npm and testing it using a specific version of the
node runtime.

Still a work in progress

Show help
```
bin/citgm --help
```

Run the modules tests
```
bin/citgm async
```

With intialization and teardown scripts
```
bin/citgm -i init.js -t teardown.js async
```
