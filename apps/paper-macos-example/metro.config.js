/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const pack = require('../../package.json');

const root = path.resolve(__dirname, '../..');
const projectNodeModules = path.join(__dirname, 'node_modules');

const modules = [...Object.keys(pack.peerDependencies), 'react-native-macos'];

const config = {
  projectRoot: __dirname,
  watchFolders: [root],
  resolver: {
    blockList: exclusionList(
      modules.map(
        m => new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`),
      ),
    ),

    nodeModulesPaths: [projectNodeModules, path.join(__dirname, '../../')],
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
      },
    }),
    assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
