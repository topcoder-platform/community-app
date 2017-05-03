const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies

const defaultConfig = require('./default');

module.exports = webpackMerge(defaultConfig, {
  module: {
    /* To avoid bundling of redux-devtools into production bundle. */
    noParse: /\/src\/shared\/containers\/DevTools/,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new OptimizeCssAssetsPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ],
});
