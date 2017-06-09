const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies

const defaultConfig = require('./default');

module.exports = webpackMerge(defaultConfig, {
  module: {
    noParse: [
      /* NodeJS library for https://logentries.com. It is server-side only. */
      /\/node_modules\/le_node/,

      /\/node_modules\/xml2json/,

      /* To avoid bundling of redux-devtools into production bundle. */
      /\/src\/shared\/containers\/DevTools/,
    ],
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
