/** Select the application configuration for CLI builds and server startup. */
module.exports = function buildConfig(environment) {
  const env = typeof environment === 'string' ? environment
    : ['production', 'development', 'qa'].find(name => environment && environment[name]);
  if (!['production', 'development', 'qa'].includes(env)) throw new Error('Unknown build environment');
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(`./config/webpack/${env}.js`);
};
