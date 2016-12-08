'use strict';

var fs = require('fs');
var execSync = require('child_process').execSync;
var _ = require('lodash');
var semver = require('semver');

var version = process.version;
var semVersion = semver.major(process.version) + '.' +
                 semver.minor(process.version) + '.' +
                 semver.patch(process.version);
var platform = process.platform;
var arch = process.arch;
var distro = '';
var release = '';

/* istanbul ignore next: these are platform specific and hard to cover */
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

var endian = process.config.variables.node_byteorder || /* istanbul ignore next: hard to reach edgecase */ '';

function isStringMatch(conditions) {
  if (semver.validRange(conditions) && semver.satisfies(semVersion, conditions))
    return true;
  var checks = [distro, release, version, [platform, arch].join('-'), endian];
  return _.some(checks, function (check) {
    return check.search(conditions) !== -1;
  });
}

function isArrayMatch(arr) {
  return _.some(arr, function(item) {
    if (typeof item === 'string') return isStringMatch(item);
    if (typeof item === 'object') return isObjectMatch(item);
    return false;
  });
}

function isObjectMatch(obj) {
  return _.some(obj, function(value, key) {
    if (!isStringMatch(key)) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return isStringMatch(value);
    if (value instanceof Array) return isArrayMatch(value);
    return false;
  });
}

function isMatch(conditions) {
  if (typeof conditions === 'boolean') return conditions;
  if (typeof conditions === 'string') return isStringMatch(conditions);
  if (conditions instanceof Array) return isArrayMatch(conditions);
  if (typeof conditions === 'object') return isObjectMatch(conditions);
  return false;
}

module.exports = isMatch;
