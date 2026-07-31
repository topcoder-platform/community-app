/**
 * Babel preset for server-side rendering and precompiled Node sources.
 */

const postcssScss = require('postcss-scss');
const createConfig = require('./create');
const { generateScopedName } = require('../css-modules');

/**
 * Creates the Node Babel preset.
 *
 * @param {Object} api Babel preset API.
 * @param {Object} options Preset options.
 * @return {Object} Node-oriented Babel configuration.
 */
module.exports = function nodePreset(api, options = {}) {
  const config = createConfig({ node: true });
  const baseAssetsOutputPath = options.baseAssetsOutputPath || '';

  config.plugins.push(
    'dynamic-import-node',
    ['transform-assets', {
      extensions: ['gif', 'jpeg', 'jpg', 'png', '.svg'],
      name: `${baseAssetsOutputPath}/images/[hash].[ext]`,
    }],
    ['css-modules-transform', {
      extensions: ['.css', '.scss'],
      generateScopedName,
      processorOpts: {
        parser: postcssScss,
      },
    }],
  );

  return config;
};
