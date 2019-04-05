'use strict';

const assert = require('assert');
const { existsSync } = require('fs');
const { join } = require('path');

assert(existsSync(join(__dirname, '.testbuilt')));
