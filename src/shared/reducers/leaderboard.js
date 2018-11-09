/**
 * Reducer for the community leaderboard page
 */

import actions from 'actions/leaderboard';
import metaActions from 'actions/tc-communities/meta';
import { redux } from 'topcoder-react-utils';
import { getAuthTokens } from 'utils/tc';

/**
 * Handles leaderboard.fetchLeaderboard action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onDone(state, action) {
  return {
    ...state,
    data: action.error ? null : action.payload.data,
    loadedApiUrl: action.error ? null : action.payload.loadedApiUrl,
    failed: !!action.error,
    loading: false,
  };
}

/**
 * Creates a new Leaderboard reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return Leaderboard reducer.
 */
function create(initialState) {
  return redux.handleActions({
    [actions.leaderboard.fetchLeaderboardInit](state) {
      return {
        ...state,
        data: null,
        loadedApiUrl: null,
        failed: false,
        loading: true,
      };
    },
    [actions.leaderboard.fetchLeaderboardDone]: onDone,
  }, initialState || {});
}

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for efficient server-side rendering).
 * If HTTP request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory(req) {
  /* Server-side rendering of Leaderboard Page for communities. */
  const match = req && req.url.match(/community\/([^/]+)\/leaderboard/);

  if (match) {
    const tokens = getAuthTokens(req);
    const communityId = match[1];
    // as every community can has its own leaderboard page url
    // we are trying to get leadeboard page url from community meta data api
    return metaActions.tcCommunities.meta
      .fetchDataDone(null, communityId).payload.then(({ data }) => {
        // reject if there is no leaderboardApiUrl for current community
        if (!data.leaderboardApiUrl) {
          return Promise.reject();
        }

        return redux.resolveAction(actions.leaderboard.fetchLeaderboardDone(
          tokens,
          data.leaderboardApiUrl,
        )).then(response => create(onDone({}, response)));
      });
  }
  /* Otherwise this part of Redux state is initialized empty. */
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
