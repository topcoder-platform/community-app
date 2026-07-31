/**
 * Creates the Babel configurations used by the browser bundle and Node server.
 */

const path = require('path');
const {
  generateScopedName,
  generateTestScopedName,
} = require('../css-modules');

/**
 * Returns the shared browser-compatible Babel configuration.
 *
 * @param {Object} options Configuration options.
 * @param {Boolean} options.node Whether the output targets the Node runtime.
 * @return {Object} Babel preset configuration.
 */
function createConfig({ node = false } = {}) {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV || 'development';
  const cssModules = {
    filetypes: {
      '.scss': {
        syntax: 'postcss-scss',
      },
    },
    generateScopedName: env === 'test'
      ? generateTestScopedName
      : generateScopedName,
  };

  const moduleResolver = {
    extensions: ['.js', '.jsx'],
    root: [
      path.resolve(__dirname, '../../src/shared'),
      path.resolve(__dirname, '../../src'),
    ],
  };

  if (node) {
    moduleResolver.transformFunctions = [
      'resolveWeak',
      'webpack.resolveWeak',
    ];
  }

  const plugins = [
    ['module-resolver', moduleResolver],
    ['inline-react-svg', {
      svgo: {
        plugins: [{
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        }],
      },
    }],
    ['@babel/plugin-transform-runtime', {
      corejs: false,
      helpers: true,
      regenerator: true,
    }],
    ['react-css-modules', cssModules],
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-proposal-export-default-from',
  ];

  if (!node && env === 'development') {
    plugins.push('react-hot-loader/babel');
  }

  return {
    presets: [
      ['@babel/preset-env', {
        bugfixes: true,
        modules: node ? 'commonjs' : false,
        targets: node ? { node: '24' } : '> 0.5%, not dead',
      }],
      ['@babel/preset-react', {
        runtime: 'classic',
      }],
    ],
    plugins,
  };
}

module.exports = createConfig;
