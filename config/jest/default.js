const config = require('topcoder-react-utils/config/jest/default');
const nodeConfig = require('config');

config.transformIgnorePatterns[0] = '/node_modules/(?!appirio-tech|topcoder|tc-)';

// Include the directories whose tests has been written to minimize coverage time
config.collectCoverageFrom = ['src/client/*.{js,jsx}', 'src/server/*.{js,jsx}', 'src/shared/*.{js,jsx}'];

module.exports = {
  ...config,
  globals: {
    CONFIG: nodeConfig,
  },
};
