const MESSAGE = 'glob is only available in Node.js';

function unavailable() {
  throw new Error(MESSAGE);
}

/**
 * Keeps server-only dependencies importable in a browser bundle without
 * pulling glob's Node.js implementation and core-module dependencies into it.
 *
 * @param {String|String[]} pattern Unused glob pattern.
 * @param {Object|Function} options Unused options or legacy callback.
 * @param {Function} callback Optional legacy callback.
 * @return {Promise<String[]>|undefined} Rejected promise, or callback result.
 */
function glob(pattern, options, callback) {
  const done = typeof options === 'function' ? options : callback;
  const error = new Error(MESSAGE);

  if (done) {
    done(error);
    return undefined;
  }

  return Promise.reject(error);
}

glob.glob = glob;
glob.globSync = unavailable;
glob.sync = unavailable;
glob.hasMagic = unavailable;
glob.escape = unavailable;
glob.unescape = unavailable;
glob.Glob = unavailable;
glob.Ignore = unavailable;

module.exports = glob;
