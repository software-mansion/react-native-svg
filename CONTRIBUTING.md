# Contributing to React Native Svg

Thank you for helping out with react-native-svg!
We'd like to make contributions as pleasant as possible, so here's a small guide of how we see it. Happy to hear your
feedback about anything, so please let us know.

### Modifying react-native-svg

1. Fork this repository
2. Clone your fork
3. Make a branch for your feature or bug fix (i.e. `git checkout -b added-getfoobar`)
4. Work your magic
5. Execute `yarn link` when done.

### Testing your changes

Add test example in [tests-example](https://github.com/react-native-svg/react-native-svg/tree/main/tests-example)
concerning your change following the convention of `TestX.tsx` where `X` is your PR number.

## Tests

We use `typescript` for type checks, `eslint` with `prettier` for linting/formatting. All tests are run by github
actions for all opened pull requests.

- `yarn test`: Run all tests, except for e2e (see note below).
- `yarn lint`: Run `eslint` check.
- `yarn tsc`: Run `typescript` check.
- `yarn jest`: Run `jest` type check.
- `yarn e2e`: Run E2E tests (see section below)

### Running E2E tests:

> [!WARNING]  
> Reference images in this repository are generated with [pixel ratio](https://reactnative.dev/docs/pixelratio) = `3`.
> Make sure to run tests on a device that also has pixel ratio equal 3. Otherwise tests will fail.
> In order to use device with different pixel ratio, adjust it in `e2e/generateRefereces.ts` viewport and regenerate
> references.

1. Navigate to the example application's directory and initiate the Metro server using the yarn start command.
2. To run the example application on your preferred platform (note: currently only Android and iOS are supported),
   execute the command `yarn android` or `yarn ios` within the example app's directory.
3. Start the Jest server by running `yarn e2e` in the project's root directory.
4. In the example application, select the E2E tab.
5. Allow the tests to complete.
6. The test results, along with any differences (i.e. the actual rendered svg versus the reference image), can be viewed
   in the `e2e/diffs` directory.

### To add new E2E test cases, proceed as follows:

1. Put an SVG file of your selection into the `e2e/cases` directory.
2. Execute `yarn generateE2eRefrences`. This action launches a headless Chrome browser via Puppeteer, capturing
   snapshots of all rendered SVGs as .png files. These files will serve as a reference during testing.
3. Check the `e2e/references` directory to observe newly created .png files.
4. When you rerun the E2E tests, the new test case(s) you've added will be incorporated.

## Sending a pull request

When you're sending a pull request:

- Communication is a key. If you want fix/add something, please consider either opening a new issue or finding an
  existing one so we can further discuss it.
- We prefer small pull requests focused on one change, as those are easier to test/check.
- Please make sure that all tests are passing on your local machine.
- Follow the template when opening a PR.

## Commits and versioning

All PRs are merged into the `main` branch and released with `release-it`.

Most notably prefixes you'll see:

- **fix**: Bug fixes
- **feat**: New feature implemented
- **chore**: Changes that are not affecting end user (CI config changes,
  scripts, ["grunt work"](https://stackoverflow.com/a/26944812/3510245))
- **docs**: Documentation changes.
- **perf**: A code change that improves performance.
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **test**: Adding missing tests or correcting existing tests.

## Release process

We use [release-it](https://github.com/release-it/release-it) to release new versions of library from `main` branch.

## Reporting issues

You can report issues on our [bug tracker](https://github.com/react-native-community/react-native-svg/issues). Please
search for existing issues and follow the issue template when opening one.

## License

By contributing to React Native Svg, you agree that your contributions will be licensed under the **MIT** license.
