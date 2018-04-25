/**
 * Reducer for state.auth.
 */

import actions from 'actions/auth';
import communityActions from 'actions/tc-communities';
import { decodeToken } from 'tc-accounts';
import { getAuthTokens } from 'utils/tc';
import { redux } from 'topcoder-react-utils';

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
  return redux.handleActions({
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
    [communityActions.tcCommunity.joinDone]: (state, { payload }) => ({
      ...state,
      profile: {
        ...state.profile,
        groups: state.profile.groups.concat({ id: payload.groupId.toString() }),
      },
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
  const state = {
    ...getAuthTokens(req),
    authenticating: true,
    user: null,
  };
  if (state.tokenV3) {
    state.user = decodeToken(state.tokenV3);
    return redux.resolveAction(actions.auth.loadProfile(state.tokenV3))
      .then(res => create(onProfileLoaded(state, res)));
  }
  return Promise.resolve(create(state));
}

/* Default reducer with empty initial state. */
export default create();
