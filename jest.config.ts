import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^mocks/(.*)$': '<rootDir>/__mocks__/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transformIgnorePatterns: [],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
  },
  // transform: {
  //   // Use babel-jest to transpile tests with the next/babel preset
  //   // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
  //   '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['@babel/preset-env'] }],
  // },
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  //transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
//export default createJestConfig(config);

const asyncConfig = createJestConfig(customJestConfig);
const defaultExport = async () => {
  const config = await asyncConfig();

  config.transformIgnorePatterns = [
    //'/node_modules/(?!(@sitecore|@sitecore-cloudsdk|@sitecore-feaas|@sitecore-jss)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ];

  return config;
};

export default defaultExport;
