const autoprefixer = require('autoprefixer');
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
      /* Using ExtractTextPlugin in dev environment would prevent hot reloading
       * of styles. */
      test: /\.scss$/,
      exclude: /(bower_components|node_modules)/,
      use: ['style-loader', {
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
    }, {
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
            alias: {
              // NOTE: Some aliases related to assets and styles are defined in
              // webpack config.
              actions: './actions',
              components: './components',
              containers: './containers',
              reducers: './reducers',
              routes: './routes',
              server: './server',
              services: './services',
              utils: './utils',
            },
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
});
