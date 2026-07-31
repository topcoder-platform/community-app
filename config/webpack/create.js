/**
 * Modern Webpack configuration shared by development, QA, and production.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  asGenerator,
  createJoinFunction,
  createJoinImplementation,
  defaultJoinGenerator,
} = require('resolve-url-loader');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const webpack = require('webpack');
const { generateScopedName } = require('../css-modules');

const context = path.resolve(__dirname, '../..');
const sourceRoot = path.resolve(context, 'src');
const resolveProjectAssets = createJoinFunction(
  'resolveProjectAssets',
  createJoinImplementation(asGenerator(
    (item, ...rest) => [
      ...defaultJoinGenerator(item, ...rest),
      item.isAbsolute ? null : sourceRoot,
    ],
  )),
);

/**
 * Reads or creates the public metadata shared by the server and bundle.
 *
 * @param {String} publicPath Public URL for emitted assets.
 * @param {Boolean} keepExisting Whether an existing build record should be reused.
 * @return {Object} Build metadata.
 */
function getBuildInfo(publicPath, keepExisting) {
  const filename = path.join(context, '.build-info');
  if (keepExisting && fs.existsSync(filename)) {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  }

  const info = {
    key: crypto.randomBytes(32).toString('base64url'),
    publicPath,
    timestamp: new Date().toISOString(),
    crossOriginLoading: 'anonymous',
  };
  fs.writeFileSync(filename, JSON.stringify(info));
  return info;
}

/**
 * Emits the small static web-app manifest without a vulnerable image toolchain.
 */
class WebAppManifestPlugin {
  /**
   * Adds manifest.json to the Webpack compilation.
   *
   * @param {Object} compiler Webpack compiler.
   * @return {void}
   */
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('WebAppManifestPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'WebAppManifestPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          const manifest = {
            name: 'TC Challenges',
            short_name: 'Challenges',
            start_url: '/challenges',
            background_color: '#ffffff',
            theme_color: '#ffffff',
            scope: '/',
            icons: [
              {
                src: '/api/cdn/public/static-assets/images/logo-192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: '/api/cdn/public/static-assets/images/logo-512.png',
                sizes: '512x512',
                type: 'image/png',
              },
            ],
          };
          compilation.emitAsset(
            'manifest.json',
            new compiler.webpack.sources.RawSource(JSON.stringify(manifest, null, 2)),
          );
        },
      );
    });
  }
}

/**
 * Creates a Webpack configuration for one deployment mode.
 *
 * @param {'development'|'production'|'qa'} requestedMode Deployment mode.
 * @return {Object} Webpack configuration.
 */
module.exports = function createWebpackConfig(requestedMode) {
  const development = requestedMode === 'development';
  const production = requestedMode === 'production';
  const babelEnv = development ? 'development' : 'production';
  process.env.BABEL_ENV = babelEnv;

  let publicPath = development ? '/api/cdn/public' : process.env.CDN_URL;
  if (!publicPath) publicPath = '/api/cdn/public';
  publicPath = `${publicPath}/static-assets`;

  const buildInfo = getBuildInfo(publicPath, Boolean(global.KEEP_BUILD_INFO));
  const timestamp = Date.parse(buildInfo.timestamp);
  const cssLoader = {
    loader: 'css-loader',
    options: {
      esModule: false,
      modules: {
        getLocalIdent: (loaderContext, localIdentName, localName) => (
          generateScopedName(localName, loaderContext.resourcePath)
        ),
      },
    },
  };

  const config = {
    context,
    mode: development ? 'development' : 'production',
    externals: {
      // topcoder-react-lib only loads this transport in its server branch.
      le_node: 'null',
    },
    entry: {
      polyfills: [
        'core-js/stable',
        'regenerator-runtime/runtime',
        `topcoder-react-utils/dist/${development ? 'dev' : 'prod'}/client/init`,
      ],
      'loading-indicator-animation': './src/client/loading-indicator-animation',
      main: './src/client',
    },
    output: {
      chunkFilename: `[name]-${timestamp}.js`,
      crossOriginLoading: 'anonymous',
      filename: `[name]-${timestamp}.js`,
      path: path.resolve(context, 'build'),
      publicPath: `${publicPath}/`,
    },
    devtool: development ? 'eval-cheap-module-source-map' : 'source-map',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: [
            /node_modules[\\/](?!appirio-tech.*|topcoder|tc-|@topcoder)/,
            /src[\\/]assets[\\/]fonts/,
            /src[\\/]assets[\\/]images[\\/]dashboard/,
          ],
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              configFile: false,
              presets: [path.resolve(__dirname, '../babel/webpack.js')],
            },
          },
        },
        {
          test: /\.(eot|otf|ttf|woff2?)$/,
          type: 'javascript/auto',
          use: {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: '[hash].[ext]',
              outputPath: 'fonts',
              publicPath: `${publicPath}/fonts`,
            },
          },
        },
        {
          test: /\.(gif|jpe?g|png|svg)$/,
          type: 'javascript/auto',
          use: {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: '[hash].[ext]',
              outputPath: 'images',
              publicPath: `${publicPath}/images`,
            },
          },
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            cssLoader,
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [autoprefixer()],
                },
              },
            },
            {
              loader: 'resolve-url-loader',
              options: {
                join: resolveProjectAssets,
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                esModule: false,
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: false,
      splitChunks: false,
    },
    plugins: [
      new MiniCssExtractPlugin({
        chunkFilename: `[name]-${timestamp}.css`,
        filename: `[name]-${timestamp}.css`,
      }),
      new webpack.DefinePlugin({
        BUILD_INFO: JSON.stringify(buildInfo),
        'process.env.BABEL_ENV': JSON.stringify(babelEnv),
        'process.env.DEV_TOOLS': JSON.stringify(development),
        'process.env.NODE_ENV': JSON.stringify(production ? 'production' : requestedMode),
      }),
      new StatsWriterPlugin({
        filename: '__stats__.json',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(context, 'src/assets/mock-data'),
            to: path.resolve(context, 'build/mock-data'),
          },
          {
            from: path.resolve(context, 'src/assets/themes'),
            to: path.resolve(context, 'build/themes'),
          },
          {
            from: path.resolve(context, 'src/server/noopsw.js'),
            to: path.resolve(context, 'build/noopsw.js'),
          },
          {
            from: path.resolve(context, 'src/server/sw.js'),
            to: path.resolve(context, 'build/sw.js'),
          },
          {
            from: path.resolve(context, 'src/assets/images/logo-192.png'),
            to: path.resolve(context, 'build/images/logo-192.png'),
          },
          {
            from: path.resolve(context, 'src/assets/images/logo-512.png'),
            to: path.resolve(context, 'build/images/logo-512.png'),
          },
        ],
      }),
      new WebAppManifestPlugin(),
    ],
    resolve: {
      alias: {
        assets: path.resolve(context, 'src/assets'),
        components: path.resolve(context, 'src/shared/components'),
        config$: path.resolve(__dirname, 'browser/config.js'),
        fonts: path.resolve(context, 'src/assets/fonts'),
        'react/jsx-runtime$': require.resolve('react/jsx-runtime.js'),
        styles: path.resolve(context, 'src/styles'),
        'tc-core-library-js$': path.resolve(__dirname, 'browser/tc-core-library-js.js'),
      },
      extensions: ['.js', '.json', '.jsx', '.scss'],
      fallback: {
        buffer: false,
        crypto: false,
        fs: false,
        net: false,
        path: false,
        tls: false,
        url: false,
        util: false,
      },
      symlinks: false,
    },
  };

  if (development) {
    config.entry.main = [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?reload=true',
      config.entry.main,
    ];
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    );
  }

  return config;
};
