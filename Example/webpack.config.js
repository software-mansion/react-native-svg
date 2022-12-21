'use strict';

const path = require('path');
const fromRoot = _ => path.resolve(__dirname, _);

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: fromRoot('index.js'),
  output: {
    path: fromRoot('dist'),
    filename: 'bundle.web.js',
  },
  devServer: {
    static: {directory: fromRoot('dist')},
    devMiddleware: {publicPath: '/'},
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        use: {loader: 'babel-loader'},
        include: [
          fromRoot('index.js'),
          fromRoot('src'),
          fromRoot('node_modules/react-native-svg'),
          fromRoot('node_modules/react-native-reanimated'),
        ],
      },
      {
        test: /\.(gif|jpe?g|png)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {esModule: false},
          },
        ],
      },
    ],
  },
  resolve: {
    symlinks: false,
    alias: {
      'react-native$': 'react-native-web',
    },
    extensions: [
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.web.js',
      '.js',
      '.web.jsx',
      '.jsx',
    ],
  },
  plugins: [new (require('webpack').DefinePlugin)({process: {env: {}}})],
};
