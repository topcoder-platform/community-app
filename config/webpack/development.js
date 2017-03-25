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
      }, 'resolve-url-loader', {
        loader: 'postcss-loader',
        options: {
          plugins: [],
        },
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      }],
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
