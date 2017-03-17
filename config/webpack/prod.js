const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies

const baseConfig = require('./base');

module.exports = webpackMerge(baseConfig, {
  plugins: [
    new OptimizeCssAssetsPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ],
});
