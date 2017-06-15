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
    noParse: [
      /* NodeJS library for https://logentries.com. It is server-side only. */
      /\/node_modules\/le_node/,

      /\/node_modules\/xml2json/,
    ],
    rules: [{
      test: /\.(eot|otf|svg|ttf|woff|woff2)$/,
      include: [
        /src\/assets\/fonts/,
        /node_modules/,
      ],
      loader: 'file-loader',
      options: {
        outputPath: '/fonts/',
        publicPath: '/fonts/../',
      },
    }, {
      test: /\.(jsx?|svg)$/,
      exclude: [
        /node_modules\/(?!appirio-tech.*|topcoder|tc-)/,
        /src\/assets\/fonts/,
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
              '.scss': 'postcss-scss',
            },
          }],
        ],
      },
    }, {
      test: /\.(gif|jpeg|jpg|png)$/,
      include: /src\/assets\/images/,
      loader: 'file-loader',
      options: {
        outputPath: '/images/',
        publicPath: '/images/../',
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
    }, {
      /* We need to support css loading for third-party plugins,
       * we are not supposed to use css files inside the project. */
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader'],
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
    }, {
      from: path.resolve(__dirname, '../../src/assets/themes'),
      to: path.resolve(__dirname, '../../build/themes'),
    }]),
    new ExtractTextPlugin({
      allChunks: true,
      filename: 'style.css',
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
