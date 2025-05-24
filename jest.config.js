export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.*'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 25,
      statements: 25,
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
};
