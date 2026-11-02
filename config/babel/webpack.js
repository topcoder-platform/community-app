// Babel 7 equivalent of the legacy Topcoder React build preset.
const path = require('path');

module.exports = (api, options = {}) => {
  const mode = options.mode || process.env.BABEL_ENV;
  let generateScopedName = '[hash:base64:6]';
  if (mode === 'development') generateScopedName = '[path][name]___[local]___[hash:base64:6]';
  if (mode === 'test') generateScopedName = undefined;
  return {
    presets: [
      ['@babel/preset-env', options.server ? { targets: { node: '24' } } : { modules: false }],
      ['@babel/preset-react', { runtime: 'classic' }],
    ],
    plugins: [
      ['module-resolver', {
        extensions: ['.js', '.jsx'],
        root: [path.resolve(__dirname, '../../src/shared'), path.resolve(__dirname, '../../src')],
        transformFunctions: ['require', 'require.resolve', 'resolveWeak', 'webpack.resolveWeak'],
      }],
      ...((options.mode || process.env.BABEL_ENV) === 'development' && !options.server ? ['react-hot-loader/babel'] : []),
      ['inline-react-svg', { svgo: { plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }] } }],
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-transform-runtime',
      ['react-css-modules', {
        filetypes: { '.scss': { syntax: 'postcss-scss' } },
        generateScopedName,
      }],
      ...(options.server ? [
        'dynamic-import-node',
        ['transform-assets', { extensions: ['gif', 'jpeg', 'jpg', 'png'], name: '/community-app-assets/images/[md5:hash:hex:32].[ext]' }],
        ['css-modules-transform', { extensions: ['.css', '.scss'], generateScopedName: ['development', 'test'].includes(process.env.BABEL_ENV) ? '[path][name]___[local]___[hash:base64:6]' : '[hash:base64:6]' }],
      ] : []),
    ],
  };
};
