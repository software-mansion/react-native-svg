# react-native-svg

[![Version](https://img.shields.io/npm/v/react-native-svg.svg)](https://www.npmjs.com/package/react-native-svg)
[![NPM](https://img.shields.io/npm/dm/react-native-svg.svg)](https://www.npmjs.com/package/react-native-svg)

`react-native-svg` provides SVG support to React Native on iOS, Android, macOS, Windows, and a compatibility layer for the web.

[Check out the Example app](https://github.com/react-native-svg/react-native-svg/tree/main/Example)

- [Features](#features)
- [Installation](#installation)
- [Troubleshooting](#troubleshooting)
- [Opening issues](#opening-issues)
- [Usage](#usage)
- [TODO](#todo)
- [Known issues](#known-issues)

## Features

1. Supports most SVG elements and properties (Rect, Circle, Line, Polyline, Polygon, G ...).
2. Easy to [convert SVG code](https://svgr.now.sh/) to react-native-svg.

## Installation

### With expo-cli

> ✅ The [Expo client app](https://expo.io/tools) comes with the native code installed!

Install the JavaScript with:

```bash
expo install react-native-svg
```

📚 See the [**Expo docs**](https://docs.expo.io/versions/latest/sdk/svg/) for more info or jump ahead to [Usage](#Usage).

### With react-native-cli

1. Install library

   from npm

   ```bash
   npm install react-native-svg
   ```

   from yarn

   ```bash
   yarn add react-native-svg
   ```

2. Link native code

   ```bash
   cd ios && pod install
   ```

## Supported react-native versions

| react-native-svg | react-native |
| ---------------- | ------------ |
| 3.2.0            | 0.29         |
| 4.2.0            | 0.32         |
| 4.3.0            | 0.33         |
| 4.4.0            | 0.38         |
| 4.5.0            | 0.40         |
| 5.1.8            | 0.44         |
| 5.2.0            | 0.45         |
| 5.3.0            | 0.46         |
| 5.4.1            | 0.47         |
| 5.5.1            | >=0.50       |
| >=6              | >=0.50       |
| >=7              | >=0.57.4     |
| >=8              | >=0.57.4     |
| >=9              | >=0.57.4     |
| >=12.3.0         | >=0.63.0     |

## Troubleshooting

### Problems with Proguard

When Proguard is enabled (which it is by default for Android release builds), it causes runtime error.
To avoid this, add an exception to `android/app/proguard-rules.pro`:

```bash
-keep public class com.horcrux.svg.** {*;}
```

If you have build errors, then it might be caused by caching issues, please try:

```bash
watchman watch-del-all
rm -fr $TMPDIR/react-*
react-native start --reset-cache

Or,

rm -rf node_modules
yarn
react-native start --reset-cache
```

### Unexpected behavior

If you have unexpected behavior, please create a clean project with the latest versions of react-native and react-native-svg

```bash
react-native init CleanProject
cd CleanProject/
yarn add react-native-svg
cd ios && pod install && cd ..
```

Make a reproduction of the problem in `App.js`

```bash
react-native run-ios
react-native run-android
```

## Opening issues

Verify that it is still an issue with the latest version as specified in the previous step. If so, open a new issue, include the entire `App.js` file, specify what platforms you've tested, and the results of running this command:

```bash
react-native info
```

If you suspect that you've found a spec conformance bug, then you can test using your component in a react-native-web project by forking this codesandbox, to see how different browsers render the same content: <https://codesandbox.io/s/pypn6mn3y7> If any evergreen browser with significant userbase or other svg user agent renders some svg content better, or supports more of the svg and related specs, please open an issue asap.

## Usage

To check how to use the library, see [USAGE.md](https://github.com/react-native-svg/react-native-svg/blob/main/USAGE.md)

## TODO:

1. Filters ([connected PR](https://github.com/react-native-svg/react-native-svg/pull/896))

## Known issues:

1. Unable to apply focus point of RadialGradient on Android.
