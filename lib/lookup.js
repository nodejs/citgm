'use strict';
const normgit = require('normalize-git-url');
const util = require('util');
const path = require('path');

// construct the tarball url using the repo, spec and prefix config
function makeUrl(repo, spec, tags, prefix) {
  prefix = prefix || '';
  var version = (!spec || spec === '') ? 'master' : tags[spec];
  return util.format('%s/archive/%s%s.tar.gz', repo, prefix, version);
}

// pull the repository url either from the lookup table
// or the npm metadata. remove the .git suffix from the url
// if necessary, and replace the git:// prefx with https://
// if necessary
function getRepo(repo, meta) {
  var ret = normgit(repo || meta.repository.url).url;
  ret = ret.replace(/\.git$/,'');
  ret = ret.replace(/^git:/,'https:');
  return ret;
}

function getLookupTable(context) {
  try {
    var name = './lookup.json';
    if (typeof context.options.lookup === 'string') {
      name = path.resolve(process.cwd(), context.options.lookup);
    }
    return require(name);
  } catch (err) {
    return undefined;
  }
}

/**
 * Certain known modules in npm do not publish their tests,
 * causing npm test to fail. In such cases, we need to grab
 * the tarball from github. Unfortunately, it's not that
 * simple as npm does not capture the git branch detail for
 * any particular module version. Also complicating matters
 * is the fact that git branches are not named consistently.
 * The lookup mechanism allows us to make a "best guess"
 * mapping for known modules. If the -l or --lookup CLI
 * argument is known, the npm spec is converted into a
 * github tarball url using the information contained in a
 * lookup json file. When -l or --lookup is passed without
 * a value, the built-in lookup.json file is used. Alternatively,
 * the path to a different lookup json file can be specified
 **/
function resolve(context, next) {
  var lookup = getLookupTable(context);
  if (!lookup) {
    next(Error('Lookup table could not be loaded'));
    return;
  }
  var detail = context.module;
  context.emit('info','lookup',detail.name);
  var meta = context.meta;
  if (meta) {
    var rep = lookup[detail.name];
    if (rep) {
      if (rep.replace) {
        context.emit('info','lookup-found',detail.name);
        var url = makeUrl(
          getRepo(rep.repo, meta),
          detail.rawSpec,
          meta['dist-tags'],
          rep.prefix);
        context.emit('info','lookup-replace',url);
        context.module.raw = url;
      }
      if (rep.script) {
        context.emit('info','lookup-script',rep.script);
        context.options.script = rep.script;
      }
    } else {
      context.emit('info','lookup-notfound',detail.name);
    }
  }
  
  next(null,context);
}

module.exports = resolve;
