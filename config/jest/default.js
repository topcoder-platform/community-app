const upstream = require('topcoder-react-utils/config/jest/default');

const config = { ...upstream };
delete config.testURL;
delete config.setupTestFrameworkScriptFile;
config.testEnvironment = 'jsdom';
config.snapshotFormat = { escapeString: true, printBasicPrototype: true };
config.roots = ['<rootDir>/__tests__', '<rootDir>/src', '<rootDir>/__mocks__'];
config.testEnvironmentOptions = { url: 'http://localhost' };
config.setupFiles = ['<rootDir>/config/jest/polyfills.js'];
config.setupFilesAfterEnv = ['<rootDir>/config/jest/setup.js'];
config.transform = { '^.+\\.[jt]sx?$': ['babel-jest', { babelrc: false, presets: [[require.resolve('../babel/webpack'), { server: true }]] }] };
config.moduleNameMapper['^cheerio$'] = require.resolve('cheerio');
const nodeConfig = require('config');

config.transformIgnorePatterns[0] = '/node_modules/(?!appirio-tech|topcoder|tc-|@topcoder)';
// config.testMatch[0] = '**/__tests__/shared/containers/challenge-listing/FilterPanel.jsx';

// Include the directories whose tests has been written to minimize coverage time
config.collectCoverageFrom = ['src/client/*.{js,jsx}', 'src/server/*.{js,jsx}', 'src/shared/*.{js,jsx}'];

module.exports = {
  ...config,
  globals: {
    CONFIG: nodeConfig,
  },
};
