const cssProcessorOptions = require('./dev-css-optimization');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const defaultConfig = require('./default');

module.exports = webpackMerge(defaultConfig, {
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?reload=true',
    defaultConfig.entry,
  ],
  module: {
    rules: [{
      test: /\.(jsx?|svg)$/,
      exclude: [
        /node_modules\/(?!appirio-tech.*|topcoder|tc-)/,
        /src\/assets\/fonts/,
      ],
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [['env', { modules: false }], 'react', 'stage-2'],
        plugins: [
          'inline-react-svg',
          ['module-resolver', {
            extensions: ['.js', '.jsx'],
            root: [
              './src/shared',
              './src',
            ],
          }],
          'react-hot-loader/babel',
          ['react-css-modules', {
            filetypes: {
              '.scss': 'postcss-scss',
            },
          }],
        ],
      },
    }],
  },
  plugins: [
    new OptimizeCssAssetsPlugin({ cssProcessorOptions }),
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
