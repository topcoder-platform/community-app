const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    'loading-indicator-animation': './src/client/loading-indicator-animation',
  },
  module: {
    noParse: [
      /* NodeJS library for https://logentries.com. It is server-side only. */
      /[\\/]node_modules[\\/]le_node/,

      /[\\/]node_modules[\\/]xml2json/,

      /* We might import some server-side services from isomorphic code, to use
       * them at the server-side only; but these should be always ignored by
       * the Webpack. */
      /server[\\/]services[\\/]contentful/,

      /* This module is a part of requireWeak(..) implementation, it must be
       * ignored by Webpack, so that the modules required with this function
       * are not bundled. */
      /utils[\\/]router[\\/]require/,
    ],
    rules: [{
      test: /\.svg$/,
      loader: 'file-loader',
      options: {
        outputPath: '/images/',
        publicPath: '/community-app-assets',
      },
    }],
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../../src/assets/mock-data'),
      to: path.resolve(__dirname, '../../build/mock-data'),
    }, {
      from: path.resolve(__dirname, '../../src/assets/themes'),
      to: path.resolve(__dirname, '../../build/themes'),
    }]),
  ],
};
