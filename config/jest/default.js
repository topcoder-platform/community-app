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
    '/node_modules/',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!appirio-tech.*|topcoder|tc-)',
  ],
  setupTestFrameworkScriptFile: '<rootDir>/config/jest/setup.js',
};
