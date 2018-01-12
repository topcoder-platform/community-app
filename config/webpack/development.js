const _ = require('lodash');
const autoprefixer = require('autoprefixer');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const defaultConfig = require('./default');

const entry = _.clone(defaultConfig.entry);
entry.main = [
  'react-hot-loader/patch',
  'webpack-hot-middleware/client?reload=true',
  entry.main,
];

delete defaultConfig.entry;

module.exports = webpackMerge(defaultConfig, {
  entry,
  module: {
    rules: [{
      test: /\.(jsx?|svg)$/,
      exclude: [
        /node_modules[\\/](?!appirio-tech.*|topcoder|tc-)/,
        /src[\\/]assets[\\/]fonts/,
        /src[\\/]assets[\\/]images[\\/]dashboard/,
      ],
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: ['topcoder-react-utils/config/babel/webpack'],
        forceEnv: 'development',
      },
    }, {
      test: /\.scss$/,
      exclude: /(bower_components|node_modules)/,
      use: ExtractCssChunks.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            importLoaders: 3,
            localIdentName: '[path][name]___[local]',
            modules: true,
          },
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer,
            ],
          },
        }, 'resolve-url-loader', {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }],
      }),
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        DEV_TOOLS: JSON.stringify(true),
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
});
