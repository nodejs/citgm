'use strict';
var _ = require('lodash');

function getPassing(modules) {
  return _.filter(modules, function (mod) {
    return !mod.error;
  });
}

function getFlakyFails(modules) {
  return _.filter(modules, function (mod) {
    return (mod.error && mod.flaky);
  });
}

function getFails(modules) {
  return _.filter(modules, function (mod) {
    return (mod.error && !mod.flaky);
  });
}

function hasFailures(modules) {
  return _.some(modules, function (mod) {
    return (mod.error && !mod.flaky);
  });
}

function sanitizeOutput(output, delimiter) {
  return _(output.split('\n')).filter(function (item) {
    return item.length && item !== '\n' && item !== 'undefined';
  }).map(function (item) {
    return [delimiter, item].join(' ');
  }).value().join('\n');
}

module.exports = {
  getPassing: getPassing,
  getFails: getFails,
  getFlakyFails: getFlakyFails,
  hasFailures: hasFailures,
  sanitizeOutput: sanitizeOutput
};
