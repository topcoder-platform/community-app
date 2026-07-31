const nodeConfig = require('config');
const path = require('path');

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/client/*.{js,jsx}',
    'src/server/*.{js,jsx}',
    'src/shared/*.{js,jsx}',
  ],
  coverageDirectory: '__coverage__',
  globals: {
    CONFIG: nodeConfig,
  },
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  rootDir: '../..',
  setupFilesAfterEnv: [
    '<rootDir>/config/jest/setup.js',
  ],
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
    url: 'http://localhost',
  },
  testMatch: [
    '**/__tests__/**/*.js?(x)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  transform: {
    '^.+\\.(js|jsx|mjs)$': ['babel-jest', {
      babelrc: false,
      configFile: false,
      presets: [[path.resolve(__dirname, '../babel/node.js'), {
        baseAssetsOutputPath: '/community-app-assets',
      }]],
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!appirio-tech|topcoder|tc-|@topcoder|@optimizely/react-sdk|refractor|hastscript|hast-util-parse-selector|property-information|comma-separated-tokens|space-separated-tokens|parse-entities|character-entities|character-entities-legacy|character-reference-invalid|decode-named-character-reference|is-alphanumerical|is-alphabetical|is-decimal|is-hexadecimal)',
  ],
};
