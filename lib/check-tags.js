'use strict';
const _ = require('lodash');

function checkTags(options, mod, name, log) {
  // Returns true if the module should be skipped.

  if ((options.excludeTags.length && !options.includeTags.length && !mod.tags)
    || (!options.includeTags.length && !options.excludeTags.length)) {
    return false; // No checks to run.
  } else if (options.includeTags.length && !mod.tags) {
    return true; // No tags for this module.
  }

  if (typeof mod.tags === 'string') {
    mod.tags = [mod.tags]; // If mod.tags is a single string, convert to array.
  }

  let excludeTagMatches = _.intersection(options.excludeTags, mod.tags);

  if (excludeTagMatches.length) {
    log.info(name,
        `skipped as these excludeTags matched: ${excludeTagMatches}`);
    return true; // We matched an excludeTag.
  }

  let includeTagMatches = _.intersection(options.includeTags, mod.tags);

  if (includeTagMatches.length) {
    log.info(name,
        `will run as these includeTags matched: ${includeTagMatches}`);
    return false; // We matched an includeTag.
  }

  if (options.includeTags.length) {
    log.info(`${name} skipped as no includeTags matched`);
    return true; // We did not match an includeTag.
  } else {
    log.info(`${name} will run as no excludeTags matched`);
    return false; // We did not match an excludeTag.
  }

}

module.exports = checkTags;
