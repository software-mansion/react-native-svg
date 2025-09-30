import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testPathIgnorePatterns: ['/node_modules/', '/apps/'],
  preset: 'react-native',
  verbose: true,
  globalSetup: '<rootDir>/e2e/setupJest.ts',
  globalTeardown: '<rootDir>/e2e/teardownJest.ts',
  modulePathIgnorePatterns: [
    'lib/typescript',
    'helpers.ts|globals.d.ts|setupJest.ts|teardownJest.ts',
  ],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        filename: 'report.html',
      },
    ],
  ],
};

export default config;
