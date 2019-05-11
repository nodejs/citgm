'use strict';

const { writeFileSync } = require('fs');
const { join } = require('path');

writeFileSync(join(__dirname, '.testbuilt'), 'test-build ran');
