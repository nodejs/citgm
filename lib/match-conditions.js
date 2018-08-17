'use strict';
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
  const releaseMatch = osRelease.match(/\n\s*VERSION_ID="?(.*)"?/);
  release = releaseMatch ? (releaseMatch[1] || '') : '';
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
    return {
      matched: true,
      reason: 'version'
    };
  const checks = {
    'distro': distro,
    'release': release,
    'version': version,
    'platform': [platform, arch].join('-'),
    'endian': endian,
    'fips': fips
  };
  for (let key in checks) {
    if (checks[key].search(conditions) !== -1) {
      return {
        matched: true,
        reason: key
      };
    }
  }
  return { matched: false };
}

function isArrayMatch(arr) {
  for (let idx in arr) {
    const item = arr[idx];
    let result;
    if (typeof item === 'string') result = isStringMatch(item);
    if (typeof item === 'object') result = isObjectMatch(item);
    if (result && result.matched) {
      return result;
    }
  }
  return { matched: false };
}

function isObjectMatch(obj) {
  for (let key in obj) {
    if (!isStringMatch(key).matched) {
      continue;
    }
    let value = obj[key];
    if (typeof value === 'boolean') {
      return {
        result: value,
        reason: 'explicit'
      };
    }
    let result;
    if (typeof value === 'string') result = isStringMatch(value);
    if (value instanceof Array) result = isArrayMatch(value);
    if (result && result.matched) {
      return result;
    }
  }
  return { matched: false };
}

function isMatch(conditions) {
  if (typeof conditions === 'boolean' && conditions === true) {
    return {
      matched: true,
      reason: 'explicit'
    };
  }
  if (typeof conditions === 'string') return isStringMatch(conditions);
  if (conditions instanceof Array) return isArrayMatch(conditions);
  if (typeof conditions === 'object') return isObjectMatch(conditions);
  return { matched: false };
}

module.exports = isMatch;
