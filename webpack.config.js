/**
 * Webpack configuration is located inside /config/webpack folder. This file
 * is only responsible to expose the actual configuration to Webpack.
 */

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

module.exports = function buildConfig(env = {}) {
  const mode = typeof env === 'string' ? env : env.mode;
  const supportedModes = ['development', 'production', 'qa'];
  if (!supportedModes.includes(mode)) {
    throw new Error(`Unsupported Webpack environment: ${mode || '(missing)'}`);
  }
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(`./config/webpack/${mode}.js`);
};
