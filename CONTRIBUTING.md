# Contributing to React Native Svg

Thank you for helping out with react-native-svg!
We'd like to make contributions as pleasant as possible, so here's a small guide of how we see it. Happy to hear your feedback about anything, so please let us know.

### Modifying react-native-svg

1. Fork this repository
2. Clone your fork
3. Make a branch for your feature or bug fix (i.e. `git checkout -b added-getfoobar`)
4. Work your magic
5. Execute `yarn link` when done.

### Testing your changes

Add test example in [TestsExample](https://github.com/react-native-svg/react-native-svg/tree/main/TestsExample) concerning your change following the convention of `TestX.tsx` where `X` is your PR number.

## Tests

We use `typescript` for type checks, `eslint` with `prettier` for linting/formatting. All tests are run by github actions for all opened pull requests.

- `yarn test`: Run all tests, except for e2e (see note below).
- `yarn lint`: Run `eslint` check.
- `yarn tsc`: Run `typescript` check.
- `yarn flow`: Run `flow` type check.
- `yarn jest`: Run `jest` type check.

Currently e2e tests exist here: https://github.com/msand/react-native-svg-e2e/

## Sending a pull request

When you're sending a pull request:

- Communication is a key. If you want fix/add something, please consider either opening a new issue or finding an existing one so we can further discuss it.
- We prefer small pull requests focused on one change, as those are easier to test/check.
- Please make sure that all tests are passing on your local machine.
- Follow the template when opening a PR.

## Commits and versioning

All PRs are merged into the `main` branch and released with `release-it`.

Most notably prefixes you'll see:

- **fix**: Bug fixes
- **feat**: New feature implemented
- **chore**: Changes that are not affecting end user (CI config changes, scripts, ["grunt work"](https://stackoverflow.com/a/26944812/3510245))
- **docs**: Documentation changes.
- **perf**: A code change that improves performance.
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **test**: Adding missing tests or correcting existing tests.

## Release process

We use [release-it](https://github.com/release-it/release-it) to release new versions of library from `main` branch.

## Reporting issues

You can report issues on our [bug tracker](https://github.com/react-native-community/react-native-svg/issues). Please search for existing issues and follow the issue template when opening one.

## License

By contributing to React Native Svg, you agree that your contributions will be licensed under the **MIT** license.
