'use strict';
const _ = require('lodash');
const execSync = require('child_process').execSync;
const fs = require('fs');
const semver = require('semver');

// Mocked in tests
let version = process.version;
let semVersion = semver.major(process.version) + '.' +
                 semver.minor(process.version) + '.' +
                 semver.patch(process.version);
let platform = process.platform;
let arch = process.arch;
let distro = '';
let release = '';
let fips = '';

if (process.versions.openssl.indexOf('fips') !== -1) {
  // When in fips mode include `fips` as a match condition
  fips = 'fips';
}

if (fs.existsSync('/etc/os-release')) {
  const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
  distro = osRelease.match(/\n\s*ID="?(.*)"?/)[1] || '';
  release = osRelease.match(/\n\s*VERSION_ID="?(.*)"?/)[1] || '';
} else if (platform === 'darwin') {
  distro = 'macos';
  release = execSync('sw_vers -productVersion').toString() || '';
} else if (platform === 'aix' ) {
  release = execSync('oslevel').toString() || '';
  release = release.replace(/(\r\n|\n|\r)/gm, '') || '';
}

const endian = process.config.variables.node_byteorder || '';

function isStringMatch(conditions) {
  if (semver.validRange(conditions) && semver.satisfies(semVersion, conditions))
    return true;
  const checks = [distro, release, version, [platform, arch].join('-'),
    endian, fips];
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
