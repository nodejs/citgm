'use strict';

var fs = require('fs');
var execSync = require('child_process').execSync;
var _ = require('lodash');

var version = process.version;
var platform = process.platform;
var arch = process.arch;
var distro = '';
var release = '';

if (fs.existsSync('/etc/os-release')) {
  var osRelease = require('dotenv').config({path: '/etc/os-release', silent: true});
  distro = osRelease['ID'] || '';
  release = osRelease['VERSION_ID'] || '';
} else if (platform === 'darwin') {
  distro = 'macos';
  release = execSync('sw_vers -productVersion').toString() || '';
} else if (platform === 'aix' ) {
  release = execSync('oslevel').toString() || '';
  release = release.replace(/(\r\n|\n|\r)/gm,'') || '';
}

var endian = process.config.variables.node_byteorder || '';

function isStringFlaky(flaky) {
  var checks = [distro, release, version, [platform, arch].join('-'), endian];
  return _.some(checks, function (check) {
    return check.search(flaky) !== -1;
  });
}

function isArrayFlaky(arr) {
  return _.some(arr, function(item) {
    if (typeof item === 'string') return isStringFlaky(item);
    if (typeof item === 'object') return isObjectFlaky(item);
    return false;
  });
}

function isObjectFlaky(obj) {
  return _.some(obj, function(value, key) {
    if (!isStringFlaky(key)) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return isStringFlaky(value);
    if (value instanceof Array) return isArrayFlaky(value);
    return false;
  });
}

function isFlaky(flaky) {
  if (typeof flaky === 'boolean') return flaky;
  if (typeof flaky === 'string') return isStringFlaky(flaky);
  if (flaky instanceof Array) return isArrayFlaky(flaky);
  if (typeof flaky === 'object') return isObjectFlaky(flaky);
  return false;
}

module.exports = isFlaky;
