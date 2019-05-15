#!/usr/bin/env node
'use strict';

/*
  Test 'npm-install: extra install parameters' from 'npm/test-npm-install.js'
  will try to install this package as 'npm install --extra-param'. Npm converts
  extra parameters to env variables prefixed 'npm_config_'. In our example, npm
  will set 'npm_config_extra_param' to true.
*/
if (!process.env['npm_config_extra_param']) process.exit(1);
