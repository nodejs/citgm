'use strict';

const { join } = require('path');
const { tmpdir } = require('os');
const { writeFileSync } = require('fs');

writeFileSync(join(tmpdir(), 'omg-i-write-to-tmpdir-testfile'), '');
