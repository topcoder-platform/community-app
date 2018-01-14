const autoprefixer = require('autoprefixer');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies

const defaultConfig = require('./default');

module.exports = webpackMerge.smart(defaultConfig, {
  module: {
    noParse: [
      /* NodeJS library for https://logentries.com. It is server-side only. */
      /[\\/]node_modules[\\/]le_node/,

      /[\\/]node_modules[\\/]xml2json/,

      /* To avoid bundling of redux-devtools into production bundle. */
      /[\\/]src[\\/]shared[\\/]containers[\\/]DevTools/,
    ],
    rules: [{
      test: /\.scss$/,
      exclude: /(bower_components|node_modules)/,
      use: ExtractCssChunks.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            importLoaders: 3,
            localIdentName: '[hash:base64:6]',
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
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        discardUnused: false,
        reduceIdents: false,
        zindex: false,
      },
    }),

    /* TODO: It tends to make problems with dynamically loaded chunks,
     * I guess it may move some code between modules being in different
     * chunks, thus breaking the code when they are loaded in different
     * order. Should be further investigated. */
    // new webpack.optimize.ModuleConcatenationPlugin(),

    new webpack.optimize.UglifyJsPlugin(),
  ],
});
