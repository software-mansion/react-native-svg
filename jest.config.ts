import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testPathIgnorePatterns: [
    '/node_modules/',
    '/example/',
    '/tests-example/',
    '/fabric-example/',
  ],
  preset: 'react-native',
  verbose: true,
};

export default config;
