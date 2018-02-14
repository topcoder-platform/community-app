/**
 * Various helpers to deal with isomorphic aspects in the code.
 */

import fs from 'fs';
import path from 'path';

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
 */
export function isDev() {
  return process.env.BABEL_ENV === 'development';
}

/**
 * Returns true if production version of the code is running.
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
let BUILD_TIMESTAMP;
export function buildTimestamp() {
  /* This initialization block of code is placed inside the function to avoid
   * problems in case of development builds: in that case, the server is started
   * and initialized before the webpack build process, thus if we initialize on
   * the load, we'll end-up with an outdated build timestep at the service
   * side. */
  if (!BUILD_TIMESTAMP) {
    if (isServerSide()) {
      try {
        BUILD_TIMESTAMP = path.resolve(__dirname, '../../../.build-info');
        BUILD_TIMESTAMP = fs.readFileSync(BUILD_TIMESTAMP);
        BUILD_TIMESTAMP = JSON.parse(BUILD_TIMESTAMP).timestamp;
      } catch (e) {
        BUILD_TIMESTAMP = 'N/A';
      }
    } else BUILD_TIMESTAMP = process.env.BUILD_TIMESTAMP;
  }

  return BUILD_TIMESTAMP;
}
