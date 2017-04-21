const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies

const defaultConfig = require('./default');

module.exports = webpackMerge(defaultConfig, {
  module: {
    rules: [{
      test: /\.(eot|svg|ttf|woff)$/,
      include: /src\/assets\/fonts/,
      loader: 'file-loader',
      options: {
        outputPath: '/fonts/',
        publicPath: '/fonts/',
      },
    }],
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
