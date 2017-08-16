const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const context = path.resolve(__dirname, '../..');

module.exports = {
  context,
  entry: './src/client',
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
        publicPath: '',
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
        ],
      },
    }, {
      test: /\.(gif|jpeg|jpg|png|svg)$/,
      include: /src[\\/]assets[\\/]images/,
      loader: 'file-loader',
      options: {
        outputPath: '/images/',
        publicPath: '',
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
    filename: 'main.js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, '../../build'),
    publicPath: '/',
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
      justExtract: true,
    }),
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
      assets: path.resolve(__dirname, '../../src/assets'),
      styles: path.resolve(__dirname, '../../src/styles'),
    },
    extensions: ['.js', '.json', '.jsx', '.scss'],
  },
};
