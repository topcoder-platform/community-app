const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies

const path = require('path');

const configFactory
  = require('topcoder-react-utils/config/webpack/app-production');

const defaultConfig = require('./default');

const standardDevelopmentConfig = configFactory({
  context: path.resolve(__dirname, '../..'),
  entry: {
    'loading-indicator-animation': './src/client/loading-indicator-animation',
    main: './src/client',
  },
  publicPath: '/community-app-assets',
});

const jsxRule = standardDevelopmentConfig.module.rules.find(rule =>
  rule.loader === 'babel-loader');
jsxRule.exclude = [
  /node_modules[\\/](?!appirio-tech.*|topcoder|tc-)/,
  /src[\\/]assets[\\/]fonts/,
  /src[\\/]assets[\\/]images[\\/]dashboard/,
];

module.exports = webpackMerge.smart(standardDevelopmentConfig, defaultConfig, {
  module: {
    noParse: [
      /* To avoid bundling of redux-devtools into production bundle. */
      /[\\/]src[\\/]shared[\\/]containers[\\/]DevTools/,
    ],
  },
});
