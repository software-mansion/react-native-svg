<img src="https://user-images.githubusercontent.com/39658211/200319759-006c214f-941c-496c-a3c2-7de5b7ce33dc.png" width="100%" alt="React Native SVG at Software Mansion" >

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
| >=12.3.0         | >=0.64.0     |

## Support for Fabric

[Fabric](https://reactnative.dev/architecture/fabric-renderer) is React Native's new rendering system. As of [version `13.0.0`](https://github.com/react-native-svg/react-native-svg/releases/tag/v13.0.0) of this project, Fabric is supported only for react-native 0.69.0+. Support for earlier versions is not possible due to breaking changes in configuration.

| react-native-svg | react-native |
| ---------------- | ------------ |
| >=13.0.0         | 0.69.0+      |
| >=13.6.0         | 0.70.0+      |

## Troubleshooting

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

### Adding Windows support

1. `npx react-native-windows-init --overwrite`
2. `cd windows\<AppName>`
3. Open `<AppName>.vcxproj`

#### RN 0.68+

4. Scroll to the bottom until you find:
   ```xml
   <ItemGroup>
      <PackageReference Include="Microsoft.Windows.CppWinRT" Version="X.X.XXXXXX.X" />
   </ItemGroup>
   ```
5. Add the following to that `<ItemGroup>`
   ```xml
   <PackageReference Include="Win2D.uwp" Version="1.26.0" />
   ```

#### Pre RN 0.68

4. Scroll to the bottom until you find:

   ```xml
   <ImportGroup Label="ExtensionTargets">
   ```

5. Add the following to that `<ImportGroup>`
   ```xml
   <Import Project="$(SolutionDir)\packages\Win2D.uwp.1.26.0\build\native\Win2D.uwp.targets" Condition="Exists('$(SolutionDir)\packages\Win2D.uwp.1.26.0\build\native\Win2D.uwp.targets')" />
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
