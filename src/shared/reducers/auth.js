/**
 * Reducer for state.auth.
 */

import communityActions from 'actions/tc-communities';
import { getAuthTokens } from 'utils/tc';

import { reducers } from 'topcoder-react-lib';

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
    mergeReducers: {
      [communityActions.tcCommunity.joinDone]: (state, { payload }) => ({
        ...state,
        profile: {
          ...state.profile,
          groups: state.profile.groups.concat({ id: payload.groupId.toString() }),
        },
      }),
    },
  };

  return reducers.auth.factory(options);
}

/* Default reducer with empty initial state. */
export default factory();
