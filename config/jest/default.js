const config = require('topcoder-react-utils/config/jest/default');
const nodeConfig = require('config');

config.transformIgnorePatterns[0] = '/node_modules/(?!appirio-tech|topcoder|tc-)';

module.exports = {
  ...config,
  globals: {
    CONFIG: nodeConfig,
  },
};
