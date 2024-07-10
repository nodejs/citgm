## Making changes to CitGM

#### There are a few basic requirements for making changes to CitGM

- Consider creating an issue prior to submitting a PR as this can help speed up
  the process.
- Include tests for your code wherever possible.
- Include any documentation changes where necessary.
- Ensure that `npm test` passes before submitting the PR.
- Squash each logical change into a single commit.
- Follow the [commit guidelines](#commit-guidelines) below.

#### Commit Guidelines

- The first line should be 50 characters or less and contain a short description
  of the change. All words in the description should be in lowercase with the
  exception of proper nouns, acronyms, and the ones that refer to code, like
  function/variable names. The description should be prefixed with the name of
  the changed subsystem and start with an imperative verb. Example:
  `lookup: add module to lookup.json`. Use `git log` for inspiration if you are
  unsure about what the subsystem should be.
- Keep the second line blank.
- Wrap all other lines at 72 columns.
- Optionally you can include a `PR-URL:` line. (This can be useful when landing
  someone else's commits).
- If the PR fixes an issue, please include a `Fixes:` or `Closes:` line.

A good commit log can look something like this:

```
subsystem: explain the commit in one line

Body of commit message is a few lines of text, explaining things
in more detail, possibly giving some background about the issue
being fixed, etc.

The body of the commit message can be several paragraphs, and
please do proper word-wrap and keep columns shorter than about
72 characters or so. That way, `git log` will show things
nicely even when it is indented.

PR-URL: https://github.com/nodejs/citgm/pull/314
Fixes: https://github.com/nodejs/citgm/issues/313
```

## Submitting a module to CitGM

This is for adding a module to be included in the default `citgm-all` runs.

#### Hard Requirements

- Module source code must be on Github.
- Published versions must include a tag on Github
- The test process must be executable with only the commands
  `npm install && npm test` or (`yarn install && yarn test` or
  `pnpm install && pnpm test`) using the tarball downloaded from the GitHub tag
  mentioned above
- The tests pass on supported major release lines
- The maintainers of the module remain responsive when there are problems
- At least one module maintainer must be added to the lookup maintainers field

#### Soft Requirements

At least one of:

- The module must be actively used by the community OR
- The module must be heavily depended on OR
- The module must cover unique portions of our API OR
- The module fits into a key category (e.g. Testing, Streams, Monitoring, etc.)
  OR
- The module is under the Node.js foundation Github org OR
- The module is identified as an important module by a Node.js Working Group

#### Procedure

After making sure you adhere to the above requirements, do the following:

1. Add the module to
   [`lib/lookup.json`](https://github.com/nodejs/citgm/blob/HEAD/lib/lookup.json)
1. Run `npm link`
1. Make sure the `citgm <module>` tests pass
1. Commit your changes and open a PR. Please specify the hard and soft
   requirements the module fulfills
