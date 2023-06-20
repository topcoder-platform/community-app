/**
 * Webpack configuration is located inside /config/webpack folder. This file
 * is only responsible to expose the actual configuration to Webpack.
 */

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

module.exports = function buildConfig(env) {
  // eslint-disable-next-line no-console
  console.log('Building config for environment:', env);
  const config = require(`./config/webpack/${env}.js`);
  console.log('config', JSON.stringify(config)); // eslint-disable-line no-console
  return config;
};
