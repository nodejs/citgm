## Making changes to CitGM
#### There are a few basic requirements for making changes to CitGM

* Consider creating an issue prior to submitting a PR as this can help speed up
the process.
* Include tests for your code wherever possible.
* Include any documentation or man page changes where necessary.
* Ensure that `npm test` passes before submitting the PR.
* Squash each logical change into a single commit.
* Follow the [commit guidelines](#commit-guidelines) below.


#### Commit Guidelines

* The first line should be 50 characters or less and contain a short description
of the change. All words in the description should be in lowercase with the
exception of proper nouns, acronyms, and the ones that refer to code, like
function/variable names. The description should be prefixed with the name of
the changed subsystem and start with an imperative verb.
Example: `lookup: add module to lookup.json`. Use `git log` for inspiration if
you are unsure about what the subsystem should be.
* Keep the second line blank.
* Wrap all other lines at 72 columns.
* Optionally you can include a `PR-URL:` line. (This can be useful when landing
someone else's commits).
* If the PR fixes an issue, please include a `Fixes:` or `Closes:` line.

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
[Read the module requirements](README.md#requirements-for-inclusion-in-nodejs-citgm-runs)
