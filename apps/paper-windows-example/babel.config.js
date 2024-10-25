module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-proposal-export-namespace-from',
    'module:react-native-dotenv',
    'react-native-reanimated/plugin',
  ],
};
