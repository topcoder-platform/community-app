const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies

const path = require('path');

const configFactory = require('topcoder-react-utils/config/webpack/app-production');

const webpack = require('webpack');

const defaultConfig = require('./default');

let publicPath = process.env.CDN_URL;
if (publicPath) publicPath += '/static-assets';
else publicPath = '/api/cdn/public/static-assets';

const standardDevelopmentConfig = configFactory({
  context: path.resolve(__dirname, '../..'),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('qa'),
    }),
  ],
  entry: {
    'loading-indicator-animation': './src/client/loading-indicator-animation',
    main: './src/client',
  },
  keepBuildInfo: Boolean(global.KEEP_BUILD_INFO),
  publicPath,
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

// Align QA bundles with production by emitting source maps for debugging in browsers
standardDevelopmentConfig.devtool = 'source-map';

module.exports = webpackMerge.smart(standardDevelopmentConfig, defaultConfig);
