var updateNotifier = require('update-notifier');
var pkg = require('../package.json');
var out = require('./out');
var semver = require('semver');
var util = require('util');
var not = updateNotifier({
  pkg: pkg,
  name: pkg.name,
  callback: function(error, update) {
    if (update && semver.gt(update.latest, update.current)) {
      out.warn(
        'update-available',
        util.format(
          'v%s (current: v%s)\nnpm install -g %s',
          update.latest, update.current, pkg.name));
    }
  }
});
