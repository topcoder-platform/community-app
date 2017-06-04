/**
 * Reducer for state.auth.
 */

import actions from 'actions/auth';
import config from 'utils/config';
import { handleActions } from 'redux-actions';
import { decodeToken, isTokenExpired } from 'tc-accounts';
import { toFSA } from 'utils/redux';

/**
 * Handles actions.auth.loadProfile action.
 * @param {Object} state
 * @param {Object} action
 */
function onProfileLoaded(state, action) {
  return {
    ...state,
    authenticating: false,
    profile: action.payload,
  };
}

/**
 * Creates a new Auth reducer with the specified initial state.
 * @param {Object} initialState Initial state.
 * @return Auth reducer.
 */
function create(initialState) {
  return handleActions({
    [actions.auth.loadProfile]: onProfileLoaded,
    [actions.auth.setTcTokenV2]: (state, action) => ({
      ...state,
      tokenV2: action.payload,
    }),
    [actions.auth.setTcTokenV3]: (state, { payload }) => ({
      ...state,
      tokenV3: payload,
      user: payload ? decodeToken(payload) : null,
    }),
  }, initialState || {
    authenticating: true,
  });
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

  /* If tokens are expired we ignore them, because there is no easy way to
   * get fresh tokens at the server side. Not a big deal, they will be
   * refreshed at the frontend, once the App is started. */

  const adt = config.AUTH_DROP_TIME;

  let tokenV2 = cookies.tcjwt;
  if (!tokenV2 || isTokenExpired(tokenV2, adt)) tokenV2 = null;

  let tokenV3 = cookies.v3jwt;
  if (!tokenV3 || isTokenExpired(tokenV3, adt)) tokenV3 = null;

  const state = {
    authenticating: true,
    tokenV2,
    tokenV3,
    user: tokenV3 ? decodeToken(tokenV3) : null,
  };
  if (tokenV3) {
    return toFSA(actions.auth.loadProfile(tokenV3)).then(res =>
      create(onProfileLoaded(state, res)),
    );
  }
  return Promise.resolve(create(state));
}

/* Default reducer with empty initial state. */
export default create();
