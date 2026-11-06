// Adapted from topcoder-react-utils (MIT) for Webpack 5 and Babel 7.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const genericNames = require('generic-names');
const cssAliases = require('./css-aliases');

module.exports = (options) => {
  const {
    context, publicPath, keepBuildInfo, crossOriginLoading,
  } = options;
  const mode = options.mode || 'production';
  const infoPath = path.join(context, '.build-info');
  const buildInfo = keepBuildInfo && fs.existsSync(infoPath)
    ? JSON.parse(fs.readFileSync(infoPath))
    : {
      key: crypto.randomBytes(32).toString('latin1'), publicPath, timestamp: new Date().toISOString(), crossOriginLoading,
    };
  fs.writeFileSync(infoPath, JSON.stringify(buildInfo));
  const stamp = new Date(buildInfo.timestamp).valueOf();
  const cssScope = mode === 'development' ? '[path][name]___[local]___[hash:base64:6]' : '[hash:base64:6]';
  const scopeName = genericNames(cssScope, { context });
  const entry = { ...options.entry, 'auth0-popup': './src/client/auth0-popup.js', polyfills: ['core-js/stable', 'regenerator-runtime/runtime', `topcoder-react-utils/dist/${mode === 'production' ? 'prod' : 'dev'}/client/init`] };
  if (mode === 'development') {
    entry.main = ['react-hot-loader/patch', 'webpack-hot-middleware/client?reload=true', ...[].concat(entry.main)];
  }
  return {
    context,
    mode,
    node: { __dirname: true, __filename: true },
    entry,
    output: {
      path: path.join(context, 'build'),
      publicPath: `${publicPath}/`,
      filename: data => (data.chunk.name === 'auth0-popup' ? 'auth0-popup.js' : `[name]-${stamp}.js`),
      chunkFilename: `[name]-${stamp}.js`,
      crossOriginLoading,
    },
    plugins: [
      ...(mode === 'development' ? [new webpack.HotModuleReplacementPlugin()] : []),
      new MiniCssExtractPlugin({ filename: `[name]-${stamp}.css`, chunkFilename: `[name]-${stamp}.css` }),
      new webpack.DefinePlugin({ BUILD_INFO: JSON.stringify(buildInfo), 'process.env.BABEL_ENV': JSON.stringify(mode), 'process.env.NODE_ENV': JSON.stringify(mode) }),
      new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'], process: require.resolve('process/browser.js') }),
      new StatsWriterPlugin({ filename: '__stats__.json' }),
    ],
    resolve: {
      alias: {
        'react/jsx-runtime$': require.resolve('react/jsx-runtime'),
        'tc-core-library-js$': path.join(context, 'tools/core-compat/browser.cjs'),
        assets: path.join(context, 'src/assets'),
        components: path.join(context, 'src/shared/components'),
        'tc-fonts': path.join(context, 'src/assets/fonts'),
        styles: path.join(context, 'src/styles'),
      },
      extensions: ['.js', '.json', '.jsx', '.scss'],
      symlinks: false,
      fallback: {
        path: require.resolve('path-browserify'), url: require.resolve('url/'), os: require.resolve('os-browserify/browser'), vm: require.resolve('vm-browserify'), fs: false, tls: false, net: false, crypto: require.resolve('./browser-crypto.cjs'), stream: require.resolve('stream-browserify'), zlib: require.resolve('browserify-zlib'), util: require.resolve('util/'), buffer: require.resolve('buffer/'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(eot|otf|svg|ttf|woff2?)$/, include: [/node_modules/, /src[/\\]assets[/\\]fonts/], type: 'asset/resource', generator: { filename: 'fonts/[hash][ext]' },
        },
        {
          test: /\.(jsx?)$/, exclude: [/node_modules/], loader: 'babel-loader', options: { babelrc: false, presets: [[path.resolve(__dirname, '../babel/webpack.js'), { mode }]] },
        },
        {
          test: /\.(gif|jpe?g|png|svg)$/,
          exclude: [/src[/\\]assets[/\\]fonts/, /node_modules/],
          loader: 'file-loader',
          options: {
            esModule: false, name: '[md5:hash:hex:32].[ext]', outputPath: 'images/', publicPath: `${publicPath}/images/`,
          },
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { esModule: false, modules: { namedExport: false, getLocalIdent: (loaderContext, name, local) => scopeName(local, loaderContext.resourcePath) } } },
            { loader: 'postcss-loader', options: { postcssOptions: { plugins: [cssAliases, 'autoprefixer'] } } },
            { loader: 'sass-loader', options: { sourceMap: true, sassOptions: { silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions'] } } },
          ],
        },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      ],
    },
    optimization: { splitChunks: false },
  };
};
