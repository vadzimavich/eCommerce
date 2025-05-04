export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.*'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
