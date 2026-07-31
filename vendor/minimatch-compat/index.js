const modern = require('minimatch-modern');

const match = modern.minimatch;

/**
 * Preserves the callable CommonJS API used by legacy build plugins while
 * delegating all matching behavior to the maintained minimatch release.
 *
 * @param {String} value Path or value to test.
 * @param {String} pattern Glob pattern.
 * @param {Object} options Minimatch options.
 * @return {Boolean} Whether the value matches the pattern.
 */
function minimatch(value, pattern, options) {
  return match(value, pattern, options);
}

Object.assign(minimatch, modern);
minimatch.minimatch = minimatch;

module.exports = minimatch;
