const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies

const path = require('path');

const configFactory
  = require('topcoder-react-utils/config/webpack/app-production');

const defaultConfig = require('./default');

const standardDevelopmentConfig = configFactory({
  cdnPublicPath: process.env.CDN_URL,
  context: path.resolve(__dirname, '../..'),
  entry: {
    'loading-indicator-animation': './src/client/loading-indicator-animation',
    main: './src/client',
  },
  keepBuildInfo: Boolean(global.KEEP_BUILD_INFO),
  publicPath: '/api/cdn/public/static-assets',
});

const jsxRule = standardDevelopmentConfig.module.rules.find(rule =>
  rule.loader === 'babel-loader');
jsxRule.exclude = [
  /node_modules[\\/](?!appirio-tech.*|topcoder|tc-)/,
  /src[\\/]assets[\\/]fonts/,
  /src[\\/]assets[\\/]images[\\/]dashboard/,
];

module.exports = webpackMerge.smart(standardDevelopmentConfig, defaultConfig);
