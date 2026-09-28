# CITGM Release Process

This document describes the technical aspects of the citgm release process. The
intended audience is those who have been authorized to create official releases
for citgm, hosted on npm.

## Who can make a release?

Anyone with permission to merge the release PR to `main` can make a release.

## How releases work

Releases are automated via the
[release-please workflow](.github/workflows/release-please.yml) using
[Conventional Commits](https://www.conventionalcommits.org/). When a release PR
is merged, the package is published to npm automatically with provenance.

### npm Trusted Publishing

The workflow publishes via GitHub OIDC — no `NPM_TOKEN` secret is needed.
