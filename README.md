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

Run an alternate test script
```
bin/citgm lodash known/lodash/test.js
```
