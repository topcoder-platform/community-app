const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const context = path.resolve(__dirname, '../..');

module.exports = {
  context,
  entry: './src/client/App',
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(bower_components|node_modules)/,
      loader: 'babel-loader',
      /* Babel-loader is configured by .babelrc in the project's root folder. */
    }, {
      test: /\.scss$/,
      exclude: /(bower_components|node_modules)/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
            modules: true,
          },
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: [],
          },
        }],
      }),
    }, {
      test: /\.svg$/,
      loader: 'babel-loader',
      /* Babel-loader is configured by .babelrc in the project's root folder. */
    }],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../build'),
    publicPath: '/assets/',
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
};
