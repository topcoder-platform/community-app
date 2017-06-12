/*
 * OptimizeCssAssetsPlugin options to be used in development Webpack build.
 * This set of options disables all optimizations except of CSS deduplication.
 * CSS deduplication radically decreases the size of CSS bundle produced by
 * Webpack, which severally improves performance of browser's developer tools.
 * We do not want to use any other optimizations, as extra optimizations slow
 * down Webpack compilation, hence they slow down Hot Module Reloading in dev.
 */

module.exports = {
  autoprefixer: false,
  colormin: false,
  calc: false,
  convertValues: false,
  discardComments: false,
  discardEmpty: false,
  discardOverridden: false,
  discardUnused: false,
  mergeIdents: false,
  mergeLonghand: false,
  mergeRules: false,
  minifyFontValues: false,
  minifyGradients: false,
  minifyParams: false,
  minifySelectors: false,
  normalizeCharset: false,
  normalizeDisplayValues: false,
  normalizePositions: false,
  normalizeRepeatStyle: false,
  normalizeString: false,
  normalizeTimingFunctions: false,
  normalizeUnicode: false,
  normalizeUrl: false,
  normalizeWhitespace: false,
  orderedValues: false,
  rawCache: false,
  reduceIdents: false,
  reduceInitial: false,
  reduceTransforms: false,
  svgo: false,
  uniqueSelectors: false,
  zIndex: false,
};
