'use strict';

var test = require('tap').test;
var rewire = require('rewire');

var lookup = rewire('../lib/lookup');

var makeUrl = lookup.__get__('makeUrl');
var getLookupTable = lookup.get;

test('lookup: makeUrl', function (t) {
  var repo = 'https://github.com/nodejs/citgm';

  var tags = {
    latest: '0.1.0'
  };

  var prefix = 'v';

  var sha = 'abc123';

  var expected = repo + '/archive/master.tar.gz';
  var url = makeUrl(repo);
  t.equal(url, expected, 'by default makeUrl should give a link to master');

  expected = repo + '/archive/' + tags.latest + '.tar.gz';
  url = makeUrl(repo, 'latest', tags);
  t.equal(url, expected, 'if given a spec and tags it should give a link to associated version');

  expected = repo + '/archive/' + prefix + tags.latest + '.tar.gz';
  url = makeUrl(repo, 'latest', tags, prefix);
  t.equal(url, expected, 'if given a prefix it should be included in the filename');

  expected = repo + '/archive/' + sha + '.tar.gz';
  url = makeUrl(repo, 'latest', tags, prefix, sha);
  t.equal(url, expected, 'if given sha, it should be used to create download URL');

  t.end();
});

test('lookup[getLookupTable]:', function (t) {
  try {
    var table = getLookupTable({
      lookup: null
    });
  }
  catch (e) {
    t.error(e);
  }
  t.ok(table, 'table should exist');
  t.ok(table.lodash, 'lodash should be in the table');
  t.ok(table.lodash.replace, 'lodash should need to be replaced');

  t.end();
});

test('lookup[getLookupTable]: custom table', function (t) {
  try {
    var table = getLookupTable({
      lookup: 'test/fixtures/custom-lookup.json'
    });
  }
  catch (e) {
    t.error(e);
  }

  t.deepEquals(table, {
    'omg-i-pass': {
      replace: false
    },
    'omg-i-pass-too': {
      replace: true,
      prefix: 'v',
      stripAnsi: true
    }
  }, 'we should receive the expected lookup table from the fixtures folder');
  t.end();
});

test('lookup[getLookupTable]: custom table that does not exist', function (t) {
  try {
    var table = getLookupTable({
      lookup: 'test/fixtures/i-am-not-a.json'
    });
  }
  catch (e) {
    t.error(e);
  }

  t.notOk(table, 'it should return falsey if the table does not exist');
  t.end();
});

test('lookup: module not in table', function (t) {
  var context = {
    lookup: null,
    module: {
      name: 'omg-i-pass',
      raw: null
    },
    meta: {

    },
    options: {

    },
    emit: function () {}
  };

  lookup(context, function (err) {
    t.error(err);
    t.notOk(context.module.raw, 'raw should remain falsey if module is not in lookup');
    t.end();
  });
});

test('lookup: module in table', function (t) {
  var context = {
    lookup: null,
    module: {
      name: 'lodash',
      raw: null
    },
    meta: {
      repository: {
        url: 'https://github.com/lodash/lodash'
      }
    },
    options: {

    },
    emit: function () {}
  };

  lookup(context, function (err) {
    t.error(err);
    t.equals(context.module.raw, 'https://github.com/lodash/lodash/archive/master.tar.gz', 'raw should be truthy if the module was in the list');
    t.end();
  });
});

test('lookup: no table', function (t) {
  var context = {
    options: {
      lookup: 'test/fixtures/custom-lookup-does-not-exist.json'
    }
  };

  lookup(context, function (err) {
    t.equals(err && err.message, 'Lookup table could not be loaded');
    t.end();
  });
});

test('lookup: replace with no repo', function (t) {
  var context = {
    module: {
      name: 'omg-i-pass',
      raw: null
    },
    meta: {
      repository: undefined,
      version: '1.2.3'
    },
    options: {
      lookup: 'test/fixtures/custom-lookup-no-repo.json'
    },
    emit: function () {}
  };

  lookup(context, function (err) {
    t.equals(err && err.message, 'no-repository-field in package.json');
    t.end();
  });
});

test('lookup: lookup with script', function (t) {
  var context = {
    module: {
      name: 'omg-i-have-script',
      raw: null
    },
    meta: {
      repository: '/dev/null',
      version: '0.1.1'
    },
    options: {
      lookup: 'test/fixtures/custom-lookup-script.json'
    },
    emit: function () {}
  };

  lookup(context, function (err) {
    t.error(err);
    t.equals(context.options.script, './example-test-script-passing.sh');
    t.end();
  });
});

test('lookup: --fail-flaky', function (t) {
  var context = {
    lookup: null,
    module: {
      name: 'lodash',
      raw: null
    },
    meta: {
      repository: {
        url: 'https://github.com/lodash/lodash'
      }
    },
    options: {
      failFlaky: true
    },
    emit: function () {}
  };

  lookup(context, function (err) {
    t.error(err);
    t.false(context.module.flaky, 'flaky should be disabled');
    t.end();
  });
});
