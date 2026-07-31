/**
 * Babel preset for browser bundles.
 */

const createConfig = require('./create');

/**
 * Creates the Webpack Babel preset.
 *
 * @return {Object} Browser-oriented Babel configuration.
 */
module.exports = function webpackPreset() {
  return createConfig();
};
