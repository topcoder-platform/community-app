/**
 * Various utils that faciliate the usage of react-router.
 */

import SplitRoute from './SplitRoute';

export { SplitRoute };

/**
 * Requires the specified module without including it into the bundle during
 * Webpack build. This function should be executed only server-side.
 * @param {String} modulePath
 * @return Required module.
 */
export function requireWeak(modulePath) {
  /* eslint-disable global-require, import/no-dynamic-require */
  const mod = require('./require')(modulePath);
  /* eslint-enable global-require, import/no-dynamic-require */
  return mod.default || mod;
}

/**
 * Resolves provided module path with help of Babel's module resolver. As you
 * see, the function itself just returns its argument, but Babel is configured
 * to resolve the first argument of resolveWeak(..) function, so it works.
 * Note that result of this resolution may be a relative path (relative to the
 * caller module). To resolve it to an absolute path you should do
 * path.resolve(resolveWeak(modulePath)).
 * @param {String} modulePath
 * @return {String} Module path.
 */
export function resolveWeak(modulePath) {
  return modulePath;
}

export default undefined;
