module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'mjs', 'jsx', 'tsx'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.*'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.tsx?$': 'babel-jest',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },
  collectCoverage: false,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**', '!**/coverage/**', '!**/__tests__/**'],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 25,
      statements: 25,
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
  transformIgnorePatterns: ['/node_modules/(?!(swiper)/)'],
};
