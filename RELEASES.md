# CITGM Release Process

This document describes the technical aspects of the citgm release process. The
intended audience is those who have been authorized to create official releases
for citgm, hosted on npm.

## Who can make a release?

Any member of the @nodejs/citgm team can make a release.

## How to create a release

1. Ensure your branch is up to date with upstream

```bash
$ git checkout main
$ git remote update -p
$ git reset --hard upstream/main
$ git diff upstream/main # this should be a no-op
```

2. Bump the version and create tag with semver-sync

```bash
$ npm version [<newversion> | major | minor | patch]
```

3. Push to github

```bash
$ git push upstream main --follow-tags
```

4. Publish to npm

```bash
$ npm publish
```
