const path = require('path');

const context = path.resolve(__dirname, '../..');

module.exports = {
  context,
  entry: './src/client/App',
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules\/(?!appirio-tech.*|topcoder|tc-)/,
      loader: 'babel-loader',
      /* Babel-loader is configured by .babelrc in the project's root folder. */
    }, {
      test: /\.svg$/,
      loader: 'babel-loader',
      /* Babel-loader is configured by .babelrc in the project's root folder. */
    }],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../build'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
};
