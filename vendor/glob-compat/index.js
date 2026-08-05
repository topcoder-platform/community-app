const modern = require('glob-modern');

/**
 * Preserves the callable CommonJS API used by legacy build plugins while
 * delegating matching behavior to the maintained glob release.
 *
 * @param {String|String[]} pattern Glob pattern or patterns.
 * @param {Object|Function} options Glob options or a legacy callback.
 * @param {Function} callback Optional legacy callback.
 * @return {Promise<String[]>} Promise resolving to matching paths.
 */
function glob(pattern, options, callback) {
  let globOptions = options;
  let done = callback;

  if (typeof options === 'function') {
    globOptions = undefined;
    done = options;
  }

  const result = modern.glob(pattern, globOptions);

  if (done) {
    result.then(
      matches => done(null, matches),
      error => done(error),
    );
  }

  return result;
}

Object.assign(glob, modern);

module.exports = glob;
// Explicit assignments preserve named-import detection for ESM consumers.
module.exports.glob = modern.glob;
module.exports.globSync = modern.globSync;
module.exports.hasMagic = modern.hasMagic;
module.exports.escape = modern.escape;
module.exports.unescape = modern.unescape;
module.exports.Glob = modern.Glob;
module.exports.Ignore = modern.Ignore;
