module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-proposal-export-namespace-from',
    [
      'module-resolver',
      {
        extensions: ['.js', '.ts', '.tsx'],
        alias: {
          react: './node_modules/react',
          'react-native': './node_modules/react-native-web',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
