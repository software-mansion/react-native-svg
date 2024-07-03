import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testPathIgnorePatterns: ['/node_modules/', '/Example/', '/TestsExample/', '/FabricExample/'],
  preset: 'react-native',
  verbose: true,
  globalSetup: "<rootDir>/src/__tests__/setupJest.ts",
  globalTeardown: "<rootDir>/src/__tests__/teardownJest.ts",
  modulePathIgnorePatterns: ["lib/typescript", "helpers.ts|globals.d.ts|setupJest.ts|teardownJest.ts"],
};

export default config;
