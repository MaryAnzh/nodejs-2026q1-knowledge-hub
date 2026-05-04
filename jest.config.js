module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  rootDir: './test',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['dotenv/config'],
  testTimeout: 20000,
  globalSetup:
    process.env.TEST_MODE === 'auth'
      ? '<rootDir>/setup/seedAdmin.ts'
      : undefined,
};