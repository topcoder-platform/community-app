const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies

const defaultConfig = require('./default');

module.exports = webpackMerge(defaultConfig, {
  entry: [
    defaultConfig.entry,
    'webpack-hot-middleware/client?reload=true',
  ],
  module: {
    rules: [{
      /* Using ExtractTextPlugin in dev environment would prevent hot reloading
       * of styles. */
      test: /\.scss$/,
      exclude: /(bower_components|node_modules)/,
      use: ['style-loader', {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
          modules: true,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: [],
        },
      }, 'sass-loader'],
    }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
