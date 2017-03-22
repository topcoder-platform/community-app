/**
 * Reducer for state.auth.
 */

import { handleActions } from 'redux-actions';
import { decodeToken } from 'tc-accounts';

import actions from '../actions/auth';

/**
 * Creates a new Auth reducer with the specified initial state.
 * @param {Object} initialState Initial state.
 * @return Auth reducer.
 */
function create(initialState) {
  return handleActions({
    [actions.auth.setTcToken](state, action) {
      return {
        ...state,
        token: action.payload,
        user: decodeToken(action.payload),
      };
    },
  }, initialState || {});
}

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for server-side rendering). If HTTP
 * request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory(req) {
  const token = req && req.cookies ? req.cookies.tct : null;
  const user = token ? decodeToken(token) : null;
  return Promise.resolve(create({ token, user }));
}

/* Default reducer with empty initial state. */
export default create();
