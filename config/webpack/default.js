const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const context = path.resolve(__dirname, '../..');

module.exports = {
  context,
  entry: './src/client',
  module: {
    rules: [{
      test: /\.(jsx?|svg)$/,
      exclude: [
        /node_modules\/(?!appirio-tech.*|topcoder|tc-)/,
        /src\/assets\/fonts/,
      ],
      loader: 'babel-loader',
      /* NOTE: Babel configuration is taken from .babelrc, in general case.
       * For development Webpack build, however, Babel is configured directly
       * inside Webpack's development.js config. */
    }, {
      test: /\.(jpeg|jpg|png)$/,
      include: /src\/assets\/images/,
      loader: 'file-loader',
      options: {
        outputPath: '/images/',
        publicPath: '/images/',
      },
    }, {
      test: /\.scss$/,
      exclude: /(bower_components|node_modules)/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            importLoaders: 3,
            localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
            modules: true,
          },
        }, 'resolve-url-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer,
            ],
          },
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }],
      }),
    }],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../build'),
    publicPath: '/',
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../../src/assets/mock-data'),
      to: path.resolve(__dirname, '../../build/mock-data'),
    }]),
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env': {
        /* Some isomorphic code relies on this variable to determine, whether
         * it is executed client- or server-side. */
        FRONT_END: true,
      },
    }),
  ],
  resolve: {
    alias: {
      /* NOTE: Aliases related to .jsx and .jsx files are defined in Babel
       * config. */
      styles: path.resolve(__dirname, '../../src/styles'),
    },
    extensions: ['.js', '.json', '.jsx', '.scss'],
  },
};
