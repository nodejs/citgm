import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

import _ from 'lodash';
import semver from 'semver';

function getOptionsFromProcess() {
  const platform = process.platform;

  let fips = '';
  if (process.versions.openssl.indexOf('fips') !== -1) {
    // When in fips mode include `fips` as a match condition
    fips = 'fips';
  }

  let distro = '';
  let release = '';
  if (existsSync('/etc/os-release')) {
    const osRelease = readFileSync('/etc/os-release', 'utf8');
    distro = osRelease.match(/\n\s*ID="?(.*)"?/)[1] || '';
    const releaseMatch = osRelease.match(/\n\s*VERSION_ID="?(.*)"?/);
    release = releaseMatch ? releaseMatch[1] || '' : '';
  } else if (platform === 'darwin') {
    distro = 'macos';
    release = execSync('sw_vers -productVersion').toString() || '';
  } else if (platform === 'aix') {
    release = execSync('oslevel').toString() || '';
    release = release.replace(/(\r\n|\n|\r)/gm, '') || '';
  }

  const endian = process.config.variables.node_byteorder || '';

  return {
    version: process.version,
    platform,
    arch: process.arch,
    distro,
    release,
    fips,
    endian
  };
}

export class ConditionMatcher {
  constructor(options = getOptionsFromProcess()) {
    this.options = options;
    this.semVersion = `${semver.major(options.version)}.${semver.minor(
      options.version
    )}.${semver.patch(options.version)}`;
  }

  isStringMatch(conditions) {
    if (
      semver.validRange(conditions) &&
      semver.satisfies(this.semVersion, conditions)
    ) {
      return true;
    }
    const checks = [
      this.options.distro,
      this.options.release,
      this.options.version,
      [this.options.platform, this.options.arch].join('-'),
      this.options.endian,
      this.options.fips
    ];
    return _.some(checks, (check) => {
      return check.search(conditions) !== -1;
    });
  }

  isArrayMatch(arr) {
    return _.some(arr, (item) => {
      if (typeof item === 'boolean') return item;
      if (typeof item === 'string') return this.isStringMatch(item);
      if (typeof item === 'object') return this.isObjectMatch(item);
      return false;
    });
  }

  isObjectMatch(obj) {
    return _.some(obj, (value, key) => {
      if (!this.isStringMatch(key)) return false;
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') return this.isStringMatch(value);
      if (Array.isArray(value)) return this.isArrayMatch(value);
      return false;
    });
  }

  isMatch(conditions) {
    if (typeof conditions === 'boolean') return conditions;
    if (typeof conditions === 'string') return this.isStringMatch(conditions);
    if (conditions instanceof Array) return this.isArrayMatch(conditions);
    if (typeof conditions === 'object') return this.isObjectMatch(conditions);
    return false;
  }
}

export const defaultMatcher = new ConditionMatcher();
