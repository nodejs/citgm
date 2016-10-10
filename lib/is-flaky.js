'use strict';

var _ = require('lodash');
var lsb = require('dotenv').config({path: '/etc/lsb-release', silent: true});

var distro = lsb['DISTRIB_ID'] || '';
var release = lsb['DISTRIB_RELEASE'] || '';
var version = process.version;
var platform = [process.platform, process.arch].join('-');
var endian = process.config.variables.node_byteorder || '';

function isStringFlaky(flaky) {
  var checks = [distro, release, version, platform, endian];
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
