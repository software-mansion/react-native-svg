/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const fs = require('fs');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const rnPath = fs.realpathSync(
  path.resolve(require.resolve('react-native/package.json'), '..'),
);
const rnwPath = fs.realpathSync(
  path.resolve(require.resolve('react-native-windows/package.json'), '..'),
);

module.exports = {
  resolver: {
    extraNodeModules: {
      // Redirect react-native to react-native-windows
      'react-native': rnwPath,
      'react-native-windows': rnwPath,
    },
    // Include the macos platform in addition to the defaults because the fork includes macos, but doesn't declare it
    platforms: ['ios', 'android', 'windesktop', 'windows', 'web', 'macos'],
    blockList: exclusionList([
      new RegExp(
        `${(path.resolve(rnPath) + path.sep).replace(/[/\\]/g, '/')}.*`,
      ),

      // This stops "react-native run-windows" from causing the metro server to crash if its already running
      new RegExp(
        `${path.resolve(__dirname, 'windows').replace(/[/\\]/g, '/')}.*`,
      ),
      // Prevent recursive node_modules from local react-native-svg-desktop
      new RegExp(
        `${path.resolve(__dirname, 'node_modules/react-native-svg-desktop/node_modules').replace(/[/\\]/g, '/')}.*`,
      ),
      // Prevent recursive examples from local react-native-svg-desktop
      new RegExp(
        `${path.resolve(__dirname, 'node_modules/react-native-svg-desktop/example').replace(/[/\\]/g, '/')}.*`,
      ),
      // This prevents "react-native run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip
      /.*\.ProjectImports\.zip/,
    ]),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
