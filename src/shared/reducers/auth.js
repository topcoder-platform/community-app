/**
 * Reducer for state.auth.
 */

import _ from 'lodash';
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
    [actions.auth.setTcTokenV2]: (state, action) => ({
      ...state,
      tokenV2: action.payload,
    }),
    [actions.auth.setTcTokenV3]: (state, { payload }) => ({
      ...state,
      tokenV3: payload,
      user: payload ? decodeToken(payload) : null,
    }),
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
  const cookies = (req && req.cookies) || {};
  const tokenV3 = cookies.tctV3 || null;
  const state = {
    tokenV2: cookies.tcjwt || null,
    tokenV3,
    user: tokenV3 ? decodeToken(tokenV3) : null,
  };
  return Promise.resolve(create(state));
}

/* Default reducer with empty initial state. */
export default create();
