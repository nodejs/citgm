#!/usr/bin/env node
var child = require('child_process');
child.spawnSync('node',['test/test.js'], {
  stdio:[0,1,2]
});
