const path = require('path');

const webpack = require('webpack');
const webpackMerge = require('webpack-merge').merge;

const configFactory = require('./app-base');
const defaultConfig = require('./default');

const standardDevelopmentConfig = configFactory({
  context: path.resolve(__dirname, '../..'),
  mode: 'development',
  entry: {
    'loading-indicator-animation': './src/client/loading-indicator-animation',
    main: './src/client',
  },
  publicPath: '/api/cdn/public/static-assets',
  crossOriginLoading: 'anonymous',
});

const jsxRule = standardDevelopmentConfig.module.rules.find(rule => rule.loader === 'babel-loader');
jsxRule.exclude = [
  /node_modules[\\/](?!appirio-tech.*|topcoder|tc-|@topcoder)/,
  /src[\\/]assets[\\/]fonts/,
  /src[\\/]assets[\\/]images[\\/]dashboard/,
];

standardDevelopmentConfig.plugins.push(new webpack.DefinePlugin({
  PUBLIC_PATH: JSON.stringify('/api/cdn/public/static-assets'),
}));

module.exports = webpackMerge(standardDevelopmentConfig, defaultConfig);
