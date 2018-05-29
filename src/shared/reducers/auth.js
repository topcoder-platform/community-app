/**
 * Reducer for state.auth.
 */
import { reducers, reducerFactories } from 'topcoder-react-lib';
import { getAuthTokens } from 'utils/tc';

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for server-side rendering). If HTTP
 * request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory(req) {
  const options = {
    auth: getAuthTokens(req),
  };
  return reducerFactories.authFactory(options);
}

/* Default reducer with empty initial state. */
export default reducers.auth;
