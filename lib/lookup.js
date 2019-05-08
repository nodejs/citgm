'use strict';

const path = require('path');
const util = require('util');

const normgit = require('normalize-git-url');

const isMatch = require('./match-conditions');

// Construct the tarball url using the repo, spec and prefix config
function makeUrl(repo, spec, tags, prefix, sha) {
  let version;
  if (!spec)
    // Spec should already have defaulted to latest.
    version = 'master';
  else if (tags[spec]) version = tags[spec];
  // Matches npm tags like 'latest' or 'next'.
  // `spec` must match one of `meta.versions` as npm info call passed.
  else version = spec; // Matches npm versions like '1.0.0'

  prefix = prefix || '';

  if (sha) {
    prefix = '';
    version = sha;
  }

  return util.format('%s/archive/%s%s.tar.gz', repo, prefix, version);
}

function makeClone(repo, spec, tags, prefix) {
  let version;
  if (!spec) version = 'master';
  else version = (prefix || '') + tags[spec];
  return {
    url: `${repo}.git`,
    ref: version
  };
}

// Pull the repository url either from the lookup table
// Or the npm metadata. remove the .git suffix from the url
// If necessary, and replace the git:// prefx with https://
// If necessary
function getRepo(repo, meta) {
  let ret = normgit(repo || meta.repository.url).url;
  ret = ret.replace(/\.git$/, '');
  ret = ret.replace(/^git:/, 'https:');
  ret = ret.replace(/^ssh:\/\/git@/, 'https://');
  return ret;
}

function getLookupTable(options) {
  try {
    let name = './lookup.json';
    if (typeof options.lookup === 'string') {
      name = path.resolve(process.cwd(), options.lookup);
    }
    return require(name);
  } catch (err) {
    return undefined;
  }
}

/**
 * Certain known modules in npm do not publish their tests,
 * causing npm test to fail. In such cases, we need to grab
 * the tarball from github. If the package has been published
 * from its git repository, npm adds a `gitHead` property to
 * the package.json and we can use that to generate the tarball
 * URL. Otherwise, we fallback to the git tag. Complicating matters
 * is the fact that git tags are not named consistently.
 * The lookup mechanism allows us to make a "best guess"
 * mapping for known modules. If the -l or --lookup CLI
 * argument is known, the npm spec is converted into a
 * github tarball url using the information contained in a
 * lookup json file. When -l or --lookup is passed without
 * a value, the built-in lookup.json file is used. Alternatively,
 * the path to a different lookup json file can be specified
 **/
function resolve(context) {
  const lookup = getLookupTable(context.options);
  if (!lookup) {
    throw new Error('Lookup table could not be loaded');
  }
  const detail = context.module;
  context.emit('data', 'info', 'lookup', detail.name);
  const meta = context.meta;
  if (meta) {
    const rep = lookup[detail.name];
    context.module.version = meta.version;
    if (rep) {
      context.emit('data', 'info', 'lookup-found', detail.name);
      if (rep.envVar) {
        context.module.envVar = rep.envVar;
      }
      if (rep.stripAnsi) {
        context.module.stripAnsi = rep.stripAnsi;
      }
      if (typeof rep.replace === 'boolean' && !rep.replace) {
        rep.npm = true;
      }
      if (!rep.npm) {
        if (!rep.repo && !meta.repository) {
          throw new Error('no-repository-field in package.json');
        }
        if (rep.useGitClone) {
          const { url, ref } = makeClone(
            getRepo(rep.repo, meta),
            rep.master ? null : detail.fetchSpec,
            meta['dist-tags'],
            rep.prefix
          );
          context.emit(
            'data',
            'info',
            `${context.module.name} lookup-replace`,
            url
          );
          context.module.useGitClone = true;
          context.module.raw = url;
          context.module.ref = ref;
        } else {
          const gitHead = rep.master || rep.ignoreGitHead ? null : meta.gitHead;
          const url = makeUrl(
            getRepo(rep.repo, meta),
            rep.master ? null : detail.fetchSpec,
            meta['dist-tags'],
            rep.master ? null : rep.prefix,
            context.options.sha || rep.sha || gitHead
          );
          context.emit(
            'data',
            'info',
            `${context.module.name} lookup-replace`,
            url
          );
          context.module.raw = url;
        }
      }
      if (rep.install) {
        context.emit(
          'data',
          'verbose',
          `${context.module.name} lookup-install`,
          rep.install
        );
        context.module.install = rep.install;
      }
      if (rep.scripts) {
        context.emit(
          'data',
          'silly',
          `${context.module.name} lookup-scripts`,
          rep.scripts
        );
        context.module.scripts = rep.scripts;
      }
      if (rep.tags) {
        context.module.tags = rep.tags;
      }
      if (rep.yarn) {
        context.module.useYarn = true;
      }
      context.module.flaky = context.options.failFlaky
        ? false
        : isMatch(rep.flaky);
      context.module.expectFail = context.options.expectFail
        ? false
        : isMatch(rep.expectFail);
    } else {
      context.emit('data', 'info', 'lookup-notfound', detail.name);
      if (meta.gitHead) {
        const url = makeUrl(
          getRepo(null, meta),
          null,
          null,
          null,
          meta.gitHead
        );
        context.emit('data', 'info', 'lookup-githead', url);
        context.module.raw = url;
      }
    }
  }
}

module.exports = resolve;
module.exports.get = getLookupTable;
