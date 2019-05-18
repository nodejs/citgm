import _ from 'lodash';

export function checkTags(options, mod, name, log) {
  // Returns true if the module should be skipped.

  if (!options.includeTags.length && !options.excludeTags.length) {
    return false; // No checks to run.
  }

  if (typeof mod.tags === 'string') {
    mod.tags = [mod.tags]; // If mod.tags is a single string, convert to array.
  }

  if (!mod.tags) mod.tags = [];
  mod.tags.push(name);

  let excludeTagMatches = _.intersection(options.excludeTags, mod.tags);

  if (excludeTagMatches.length) {
    log.info(
      name,
      `skipped as these excludeTags matched: ${excludeTagMatches}`
    );
    return true; // We matched an excludeTag.
  }

  let includeTagMatches = _.intersection(options.includeTags, mod.tags);

  if (includeTagMatches.length) {
    log.info(
      name,
      `will run as these includeTags matched: ${includeTagMatches}`
    );
    return false; // We matched an includeTag.
  }

  if (options.includeTags.length) {
    log.info(name, 'skipped as no includeTags matched');
    return true; // We did not match an includeTag.
  } else {
    log.info(name, 'will run as no excludeTags matched');
    return false; // We did not match an excludeTag.
  }
}
