module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
  ],
  coverageDirectory: '__coverage__',
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  rootDir: '../..',
  testPathIgnorePatterns: [
    '__mocks__',
    '/node_modules/',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!appirio-tech.*|topcoder|tc-)',
  ],
  setupFiles: ['<rootDir>/config/jest/setup.js'],
};
