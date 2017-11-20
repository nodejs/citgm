'use strict';
const _ = require('lodash');
const xmlSanitizer = require('xml-sanitizer');

function getPassing(modules) {
  return _.filter(modules, function (mod) {
    return !mod.error && !mod.skipped;
  });
}

function getSkipped(modules) {
  return _.filter(modules, function (mod) {
    return mod.skipped;
  });
}

function getFlakyFails(modules) {
  return _.filter(modules, function (mod) {
    return (mod.error && mod.flaky);
  });
}

function getExpectedFails(modules) {
  return _.filter(modules, function (mod) {
    return (mod.expectFail && mod.error);
  });
}

function getFails(modules) {
  return _.filter(modules, function (mod) {
    return (mod.error && !mod.flaky && !mod.expectFail);
  });
}

function hasFailures(modules) {
  return _.some(modules, function (mod) {
    return (mod.error && !mod.flaky);
  });
}

function sanitizeOutput(output, delimiter, xml) {
  if (!output || output === '') return '';
  return _(output.split(/[\r\n]+/)).filter(function (item) {
    return item.length && item !== '\n' && item !== 'undefined';
  }).map(function (item) {
    if (xml) item = xmlSanitizer(item);
    return [delimiter, item].join(' ');
  }).value().join('\n');
}

module.exports = {
  getPassing: getPassing,
  getSkipped: getSkipped,
  getFails: getFails,
  getFlakyFails: getFlakyFails,
  getExpectedFails: getExpectedFails,
  hasFailures: hasFailures,
  sanitizeOutput: sanitizeOutput
};
