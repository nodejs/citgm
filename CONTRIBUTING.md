## Contribution Guidelines

- All changes must come in a PR
- All changes must be reviewed by another Collaborator or member of
  `@nodejs/citgm`
  - Small changes to the lookup table can be made without following the above
    process
- Changes can be landed in any way you prefer as long as it lands on the head of
  main with no merge commit

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

This project uses [Conventional Commits](https://www.conventionalcommits.org/).
Commit messages must be structured as:

```
<type>(<optional scope>): <short description>

[optional body]

[optional footers]
```

- Use a [Conventional Commits](https://www.conventionalcommits.org/) type prefix
  (`feat:`, `fix:`, `docs:`, `chore:`, etc.). `lookup:` can be used for patch
  changes to `lib/lookup.json`.
- Keep the subject line to 50 characters or less, generally in lowercase, using
  an imperative verb. Example: `feat(lookup): add express`
- Keep the second line blank.
- Wrap body lines at 72 columns.
- If the PR fixes an issue, please include a `Fixes:` or `Closes:` line.

See [RELEASES.md](RELEASES.md) for how commits drive the automated release
process.

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
