/**
 * Collection of functions useful in unit tests.
 */

/**
 * Creates a mock Flux Standard Action creator.
 * TODO: Additional options to set errors, etc. should be added.
 * TODO: It may be handier to return action created wrapped into Jest mock
 *  function.
 * @param {String} type Action type.
 * @param {Any} payload Action payload.
 */
export function mockAction(type, payload) {
  const res = () => ({ type, payload });
  res.toString = () => type;
  return res;
}

export default undefined;
