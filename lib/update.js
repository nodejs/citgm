'use strict';

const util = require('util');

const semver = require('semver');
const updateNotifier = require('update-notifier');

const pkg = require('../package.json');

module.exports = function(log) {
  updateNotifier({
    pkg: pkg,
    name: pkg.name,
    callback: function(error, update) {
      if (update && semver.gt(update.latest, update.current)) {
        log.warn(
          'update-available',
          util.format(
            'v%s (current: v%s)\nnpm install -g %s',
            update.latest,
            update.current,
            pkg.name
          )
        );
      }
    }
  });
};
