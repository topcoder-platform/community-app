/**
 * Reducer for state.tcCommunities.header
 */

import actions from 'actions/tc-communities/header';
import { handleActions } from 'redux-actions';
import { toFSA } from 'utils/redux';

/**
 * Handles tcCommunities.header.fetchDataDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onDone(state, action) {
  if (!action.error) {
    // if everything is ok, populate data from payload
    return {
      ...state,
      communityId: action.payload.communityId,
      logos: action.payload.logos,
      menuItems: action.payload.menuItems,
      failed: false,
      loading: false,
      cssUrl: action.payload.style,
      leaderboardApiUrl: action.payload.leaderboardApiUrl,
    };
  }
  // if community is not found or other error
  return {
    ...state,
    communityId: action.payload.error === '404' ? action.payload.communityId : null,
    logos: [],
    menuItems: [],
    failed: action.payload.error === '404' ? action.payload.error : true,
    loading: false,
    cssUrl: null,
    leaderboardApiUrl: null,
  };
}

/**
 * Creates a new community header reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return community header reducer.
 */
function create(initialState) {
  return handleActions({
    [actions.tcCommunities.header.mobileToggle](state) {
      return {
        ...state,
        isMobileOpen: !state.isMobileOpen,
      };
    },
    [actions.tcCommunities.header.fetchDataInit](state) {
      return {
        ...state,
        communityId: null,
        logos: [],
        menuItems: [],
        failed: false,
        loading: true,
        cssUrl: null,
        leaderboardApiUrl: null,
      };
    },
    [actions.tcCommunities.header.fetchDataDone]: onDone,
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
  const match = req && req.url.match(/\/community\/([^/]+)\//);

  if (match) {
    const communityId = match[1];

    return toFSA(actions.tcCommunities.header.fetchDataDone(communityId))
      .then(res => create(onDone({}, res)));
  }
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
