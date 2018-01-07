const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const forge = require('node-forge');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const PUBLIC_PATH = '/community-app-assets';

const context = path.resolve(__dirname, '../..');

/* This way we can inject the build timestamp both into JS bundle and into the
 * the server-side rendering flow. */
let BUILD_TIMESTAMP = new Date();
BUILD_TIMESTAMP = BUILD_TIMESTAMP.toUTCString();
fs.writeFileSync(path.resolve(context, '.build-timestamp'), BUILD_TIMESTAMP);

/* Generates a random key which will be used to encrypt/decrypt data injected
 * into HTML markup by the server. */
const INJKEY = forge.random.getBytesSync(32);
fs.writeFileSync(path.resolve(context, '.injkey'), INJKEY);

module.exports = {
  context,
  entry: {
    'loading-indicator-animation': './src/client/loading-indicator-animation',
    main: './src/client',

    /* A package of selected polyfills. Without them our lovely code will
     * crush on weird browsers like IE11, Microsoft Edge 40, etc. */
    polyfills: [
      'babel-polyfill',
      'nodelist-foreach-polyfill',
    ],
  },
  module: {
    noParse: [
      /* NodeJS library for https://logentries.com. It is server-side only. */
      /[\\/]node_modules[\\/]le_node/,

      /[\\/]node_modules[\\/]xml2json/,

      /* This module is a part of requireWeak(..) implementation, it must be
       * ignored by Webpack, so that the modules required with this function
       * are not bundled. */
      /utils[\\/]router[\\/]require/,
    ],
    rules: [{
      test: /\.(eot|otf|svg|ttf|woff|woff2)$/,
      include: [
        /src[\\/]assets[\\/]fonts/,
        /node_modules/,
      ],
      loader: 'file-loader',
      options: {
        outputPath: '/fonts/',
        publicPath: PUBLIC_PATH,
      },
    }, {
      test: /\.(jsx?|svg)$/,
      exclude: [
        /node_modules[\\/](?!appirio-tech.*|topcoder|tc-)/,
        /src[\\/]assets[\\/]fonts/,
        /src[\\/]assets[\\/]images[\\/]dashboard/,
      ],
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: ['env', 'react', 'stage-2'],
        plugins: [
          'inline-react-svg',
          ['module-resolver', {
            extensions: ['.js', '.jsx'],
            root: [
              './src/shared',
              './src',
            ],
          }],
          ['react-css-modules', {
            filetypes: {
              '.scss': {
                syntax: 'postcss-scss',
              },
            },
            generateScopedName: '[hash:base64:6]',
          }],
          'transform-runtime',
        ],
      },
    }, {
      test: /\.(gif|jpeg|jpg|png|svg)$/,
      loader: 'file-loader',
      options: {
        outputPath: '/images/',
        publicPath: PUBLIC_PATH,
      },
    }, {
      /* We need to support css loading for third-party plugins,
       * we are not supposed to use css files inside the project. */
      test: /\.css$/,
      use: ExtractCssChunks.extract({
        fallback: 'style-loader',
        use: ['css-loader'],
      }),
    }],
  },
  node: {
    __dirname: true,
    fs: 'empty',
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, '../../build'),
    publicPath: `${PUBLIC_PATH}/`,
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../../src/assets/mock-data'),
      to: path.resolve(__dirname, '../../build/mock-data'),
    }, {
      from: path.resolve(__dirname, '../../src/assets/themes'),
      to: path.resolve(__dirname, '../../build/themes'),
    }]),
    new ExtractCssChunks({
      filename: '[name].css',
    }),
    new webpack.DefinePlugin({
      INJKEY: JSON.stringify(INJKEY),
      'process.env': {
        BUILD_TIMESTAMP: JSON.stringify(BUILD_TIMESTAMP),

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
      assets: path.resolve(__dirname, '../../src/assets'),
      components: path.resolve(__dirname, '../../src/shared/components'),
      styles: path.resolve(__dirname, '../../src/styles'),
    },
    extensions: ['.js', '.json', '.jsx', '.scss'],
  },
};
