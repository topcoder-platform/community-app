/**
 * Various helpers to deal with isomorphic aspects in the code.
 */

/**
 * Returns true if the calling code is running client-side. Testing it as simple
 * as checking whether FRONT_END variable is present in environment, though
 * checking it via dedicated function will simplify any changes of this logic
 * in future, shall we need it.
 * @return True if the code is running client-side.
 */
export function isClientSide() {
  return Boolean(process.env.FRONT_END);
}

/**
 * Retruns true if development version of the code is running.
 * -  At the server-side development mode means that the server was launched by
 *    "$ npm run dev" command, rather than "$ npm start";
 * -  At the front-end development version means that the code wat bundled by
 *    "$ npm run build:dev" command, rather than "$ npm run build".
 */
export function isDev() {
  return process.env.BABEL_ENV === 'development';
}

/**
 * Returns true if production version of the code is running.
 * Just the opposite of isDev().
 */
export function isProd() {
  return process.env.BABEL_ENV === 'production';
}

/**
 * Returns true if the calling code is running server-side.
 * @return True if the code is running server-side.
 */
export function isServerSide() {
  return !process.env.FRONT_END;
}

/**
 * Returns the build timestamp. At the server side it is read from the a local
 * file, where it is saved during the Webpack build, at the client side it will
 * be overriden by the value from JS bundle (this way, if the build was done,
 * and the server is restarted, but the client still see an old version due
 * to client-side caching, he'll see the old build timestamp).
 * @return {String}
 */
export function buildTimestamp() {
  return 'Wed, 29 Nov 2017 07:40:00 GMT';
}
