const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  externals: { le_node: 'null' },
  // Retain the existing production build's minification policy.
  optimization: { minimize: false },
  plugins: [
    // Babel resolves aliases to relative paths before Webpack sees them.
    new webpack.NormalModuleReplacementPlugin(
      /(?:^|[\\/])server[\\/]services[\\/]contentful(?:\.js)?$/,
      path.resolve(__dirname, '../../src/client/shims/contentful-service.js'),
    ),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../../src/assets/mock-data'), to: 'mock-data' },
        { from: path.resolve(__dirname, '../../src/assets/themes'), to: 'themes' },
        { from: path.resolve(__dirname, '../../src/server/noopsw.js'), to: 'noopsw.js' },
        { from: path.resolve(__dirname, '../../src/assets/images/logo-192.png'), to: 'icon_192x192.png' },
        { from: path.resolve(__dirname, '../../src/assets/images/logo-512.png'), to: 'icon_512x512.png' },
        { from: path.resolve(__dirname, '../../src/server/manifest.json'), to: 'manifest.json' },
      ],
    }),
    new WorkboxPlugin.InjectManifest({
      swSrc: path.resolve(__dirname, '../../src/server/sw.js'),
      swDest: 'sw.js',
      // This worker uses runtime caching; preserve that policy without precaching the entire app.
      injectionPoint: 'self.__WB_MANIFEST',
      exclude: [/./],
    }),
  ],
};
