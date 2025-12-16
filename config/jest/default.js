const config = require('topcoder-react-utils/config/jest/default');
const nodeConfig = require('config');

config.transformIgnorePatterns[0] = '/node_modules/(?!appirio-tech|topcoder|tc-|@topcoder)';
// config.testMatch[0] = '**/__tests__/shared/containers/challenge-listing/FilterPanel.jsx';

config.moduleNameMapper = {
  '^node:(.*)$': '$1', // Map Node.js core alias to keep Jest 23 resolver happy.
  ...config.moduleNameMapper,
};

// Include the directories whose tests has been written to minimize coverage time
config.collectCoverageFrom = ['src/client/*.{js,jsx}', 'src/server/*.{js,jsx}', 'src/shared/*.{js,jsx}'];

module.exports = {
  ...config,
  globals: {
    CONFIG: nodeConfig,
  },
};
