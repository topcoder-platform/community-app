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
 */
export function isDev() {
  return process.env.NODE_ENV === 'development';
}

/**
 * Returns true if production version of the code is running.
 */
export function isProd() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Returns true if the calling code is running server-side.
 * @return True if the code is running server-side.
 */
export function isServerSide() {
  return !process.env.FRONT_END;
}

export default undefined;
