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
      /* Using file-loader to load fonts in development environment breaks
       * Webpack Hot Module Reloading (when you update styling of a page
       * using the fonts loaded with file-loader, all text using those
       * fonts dissapears). Url-loader solves this problem. */
      test: /\.(eot|svg|ttf|woff)$/,
      include: /src\/assets\/fonts/,
      loader: 'url-loader',
      options: {
        outputPath: '/fonts/',
        publicPath: '/fonts/',
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
        DEV_TOOLS: JSON.stringify(process.env.DEV_TOOLS),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
});
