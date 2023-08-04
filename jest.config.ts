import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testPathIgnorePatterns: ['/node_modules/', '/Example/', '/TestsExample/', '/FabricExample/'],
  preset: 'react-native',
  verbose: true,
};

export default config;
