import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testPathIgnorePatterns: ['/node_modules/', '/Example/', '/TestsExample/'],
  preset: 'react-native',
  verbose: true,
};

export default config;
