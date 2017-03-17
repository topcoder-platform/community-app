/**
 * Webpack configuration is located inside /config/webpack folder. This file
 * is only responsible to expose the actual configuration to Webpack.
 */

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

module.exports = function buildConfig(env) {
  return require(`./config/webpack/${env}.js`);
};
