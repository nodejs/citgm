import { EventEmitter } from 'events';
import { readFileSync } from 'fs';

import tap from 'tap';

import { getLookupTable, makeUrl, lookup } from '../lib/lookup.js';
import { parsePackageArg } from '../lib/utils.js';

const { test } = tap;

function createFakeMeta(config) {
  const { name, version = '1.0.0', repository, gitHead } = config;
  if (!name) {
    throw new Error('name is required');
  }
  const now = new Date().toISOString();
  return {
    _id: `${name}@${version}`,
    name,
    description: 'Some module',
    'dist-tags': {
      latest: version
    },
    versions: [version],
    time: {
      created: now,
      modified: now,
      [version]: now
    },
    repository,
    version,
    gitHead
  };
}

test('lookup: makeUrl', (t) => {
  t.plan(5);
  const repo = 'https://github.com/nodejs/citgm';

  const tags = {
    latest: '0.1.0'
  };

  const prefix = 'v';

  const sha = 'abc123';

  let expected = `${repo}/archive/HEAD.tar.gz`;
  let url = makeUrl(repo);
  t.equal(url, expected, 'by default makeUrl should give a link to HEAD');

  expected = `${repo}/archive/${tags.latest}.tar.gz`;
  url = makeUrl(repo, 'latest', tags);
  t.equal(
    url,
    expected,
    'if given a spec and tags it should give a link to associated version'
  );

  expected = `${repo}/archive/` + '1.0.0' + '.tar.gz';
  url = makeUrl(repo, '1.0.0', tags);
  t.equal(
    url,
    expected,
    'given a spec which is not an npm tag we should assume a Github tag'
  );

  expected = `${repo}/archive/${prefix}${tags.latest}.tar.gz`;
  url = makeUrl(repo, 'latest', tags, prefix);
  t.equal(
    url,
    expected,
    'if given a prefix it should be included in the filename'
  );

  expected = `${repo}/archive/${sha}.tar.gz`;
  url = makeUrl(repo, 'latest', tags, prefix, sha);
  t.equal(
    url,
    expected,
    'if given sha, it should be used to create download URL'
  );

  t.end();
});

test('lookup[getLookupTable]:', (t) => {
  t.plan(3);
  const table = getLookupTable({
    lookup: null
  });
  t.ok(table, 'table should exist');
  t.ok(table.lodash, 'lodash should be in the table');
  t.ok(table.weak.maintainers, 'weak should contain a maintainers parameter');
  t.end();
});

test('lookup[getLookupTable]: custom table', (t) => {
  t.plan(1);
  const table = getLookupTable({
    lookup: 'test/fixtures/custom-lookup.json'
  });
  t.same(
    table,
    {
      'omg-i-pass': {
        npm: true
      },
      'omg-i-pass-too': {
        prefix: 'v',
        stripAnsi: true
      }
    },
    'we should receive the expected lookup table from the fixtures folder'
  );
  t.end();
});

test('lookup[getLookupTable]: custom table that does not exist', (t) => {
  t.plan(1);
  const table = getLookupTable({
    lookup: 'test/fixtures/i-am-not-a.json'
  });
  t.notOk(table, 'it should return falsey if the table does not exist');
  t.end();
});

test('lookup: module not in table', (t) => {
  t.plan(1);
  const context = {
    lookup: null,
    module: parsePackageArg('omg-i-pass'),
    meta: createFakeMeta({ name: 'omg-i-pass' }),
    options: {},
    emit: function () {}
  };

  const rawBefore = context.module.raw;
  lookup(context);
  t.equal(
    context.module.raw,
    rawBefore,
    'raw should remain unchanged if module is not in lookup'
  );
  t.end();
});

test('lookup: module not in table with gitHead', (t) => {
  t.plan(1);
  const context = {
    lookup: null,
    module: parsePackageArg('omg-i-pass'),
    meta: createFakeMeta({
      name: 'omg-i-pass',
      repository: {
        url: 'https://github.com/nodejs/omg-i-pass'
      },
      gitHead: 'abc123'
    }),
    options: {},
    emit: function () {}
  };

  lookup(context);
  t.equal(
    context.module.raw,
    'https://github.com/nodejs/omg-i-pass/archive/abc123.tar.gz',
    'raw should use commit SHA if package has gitHead'
  );
  t.end();
});

test('lookup: module in table', (t) => {
  t.plan(1);
  const context = {
    lookup: null,
    module: parsePackageArg('lodash'),
    meta: createFakeMeta({
      name: 'lodash',
      repository: {
        url: 'https://github.com/lodash/lodash'
      }
    }),
    options: {},
    emit: function () {}
  };

  lookup(context);
  t.equal(
    context.module.raw,
    'https://github.com/lodash/lodash/archive/1.0.0.tar.gz',
    'raw should be truthy if the module was in the list'
  );
  t.end();
});

test('lookup: module in table with gitHead', (t) => {
  t.plan(1);
  const context = {
    lookup: null,
    module: parsePackageArg('lodash'),
    meta: createFakeMeta({
      name: 'lodash',
      repository: {
        url: 'https://github.com/lodash/lodash'
      },
      gitHead: 'abc123'
    }),
    options: {},
    emit: function () {}
  };

  lookup(context);
  t.equal(
    context.module.raw,
    'https://github.com/lodash/lodash/archive/abc123.tar.gz',
    'raw should use commit SHA if package has gitHead'
  );
  t.end();
});

test('lookup: module in table with scripts', (t) => {
  t.plan(1);
  const context = {
    module: parsePackageArg('omg-i-pass-with-scripts'),
    meta: createFakeMeta({
      name: 'omg-i-pass-with-scripts',
      repository: {
        url: 'git+https://github.com/nodejs/citgm'
      }
    }),
    options: {
      lookup: 'test/fixtures/custom-lookup-scripts.json'
    },
    emit: function () {}
  };

  lookup(context);
  t.strictSame(
    context.module.scripts,
    ['test-build', 'test'],
    'lookup should read scripts'
  );
  t.end();
});

test('lookup: module in table with useGitClone', (t) => {
  t.plan(2);
  const context = {
    lookup: null,
    module: parsePackageArg('lodash'),
    meta: createFakeMeta({
      name: 'lodash',
      version: '1.2.3',
      repository: {
        url: 'https://github.com/lodash/lodash'
      }
    }),
    options: {
      lookup: 'test/fixtures/custom-lookup-useGitClone.json'
    },
    emit: function () {}
  };

  lookup(context);
  t.equal(
    context.module.raw,
    'https://github.com/lodash/lodash.git',
    'raw should be a git URL if useGitClone is true'
  );
  t.equal(context.module.ref, 'v1.2.3');
  t.end();
});

test('lookup: no table', (t) => {
  t.plan(1);
  const context = {
    options: {
      lookup: 'test/fixtures/custom-lookup-does-not-exist.json'
    }
  };

  try {
    lookup(context);
  } catch (err) {
    t.equal(err && err.message, 'Lookup table could not be loaded');
    t.end();
  }
});

test('lookup: replace with no repo', (t) => {
  t.plan(1);
  const context = {
    module: parsePackageArg('omg-i-pass'),
    meta: createFakeMeta({
      name: 'omg-i-pass',
      version: '1.2.3'
    }),
    options: {
      lookup: 'test/fixtures/custom-lookup-no-repo.json'
    },
    emit: function () {}
  };

  try {
    lookup(context);
  } catch (err) {
    t.equal(err && err.message, 'no-repository-field in package.json');
    t.end();
  }
});

test('lookup: not found in lookup.json with --sha', (t) => {
  t.plan(1);
  const context = {
    lookup: null,
    module: parsePackageArg('test'),
    meta: createFakeMeta({
      name: 'test',
      repository: {
        url: 'https://github.com/test-org/test-repo'
      },
      gitHead: 'metaGitHead'
    }),
    options: {
      sha: 'customsha'
    },
    emit: function () {}
  };

  lookup(context);
  t.equal(
    context.module.raw,
    'https://github.com/test-org/test-repo/archive/customsha.tar.gz'
  );
  t.end();
});

test('lookup: --fail-flaky', (t) => {
  t.plan(1);
  const context = {
    lookup: null,
    module: parsePackageArg('lodash'),
    meta: createFakeMeta({
      name: 'lodash',
      repository: {
        url: 'https://github.com/lodash/lodash'
      }
    }),
    options: {
      failFlaky: true
    },
    emit: function () {}
  };

  lookup(context);
  t.notOk(context.module.flaky, 'flaky should be disabled');
  t.end();
});

test('lookup: ensure lookup works', (t) => {
  t.plan(2);
  const lookup = JSON.parse(
    readFileSync(new URL('../lib/lookup.json', import.meta.url))
  );
  t.ok(lookup, 'the lookup table should exist');

  const lookupKeys = Object.keys(lookup);
  const lookupKeysSorted = lookupKeys.slice().sort();
  t.same(
    lookupKeys,
    lookupKeysSorted,
    'the lookup table must be alphabetically sorted'
  );

  t.end();
});

test('lookup: lookup with install', (t) => {
  t.plan(1);
  const context = {
    module: parsePackageArg('omg-i-pass-with-install-param'),
    meta: createFakeMeta({
      name: 'omg-i-pass-with-install-param',
      version: '0.1.1',
      repository: '/dev/null'
    }),
    options: {
      lookup: 'test/fixtures/custom-lookup-install.json'
    },
    emit: function () {}
  };
  const expected = {
    install: [/--extra-param/]
  };

  lookup(context);
  t.match(context.module, expected, 'Read extra install parameter');
  t.end();
});

test('lookup: logging', (t) => {
  t.plan(1);
  const expectedLogMsgs = [
    { type: 'info', key: 'lookup', msg: 'omg-i-pass' },
    { type: 'info', key: 'lookup-found', msg: 'omg-i-pass' },
    {
      type: 'info',
      key: 'omg-i-pass lookup-replace',
      msg: 'https://github.com/nodejs/citgm/archive/HEAD.tar.gz'
    },
    {
      type: 'verbose',
      key: 'omg-i-pass lookup-install',
      msg: ['--extra-param']
    }
  ];
  const context = new EventEmitter();
  const log = [];
  context.meta = {
    repository: '/dev/null',
    version: '0.1.1'
  };
  context.module = {
    name: 'omg-i-pass'
  };
  context.options = {
    lookup: 'test/fixtures/custom-lookup-log.json'
  };
  context.on('data', (type, key, msg) => {
    log.push({ type: type, key: key, msg: msg });
  });
  lookup(context);
  t.strictSame(log, expectedLogMsgs);
  t.end();
});
