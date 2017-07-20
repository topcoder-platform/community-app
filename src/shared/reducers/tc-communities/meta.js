/**
 * Reducer for state.tcCommunities.meta
 */

import actions from 'actions/tc-communities/meta';
import { handleActions } from 'redux-actions';
import { toFSA } from 'utils/redux';

/**
 * Handles tcCommunities.meta.fetchDataDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onDone(state, action) {
  if (!action.error) {
    // if everything is ok, populate data from payload
    return {
      ...state,
      authorizedGroupIds: action.payload.authorizedGroupIds,
      challengeFilter: action.payload.challengeFilter,
      challengeFilterTag: action.payload.challengeFilterTag,
      groupId: action.payload.groupId,
      communityId: action.payload.communityId,
      communityName: action.payload.communityName,
      communitySelector: action.payload.communitySelector,
      cssUrl: action.payload.style,
      logos: action.payload.logos,
      hideSearch: action.payload.hideSearch,
      additionalLogos: action.payload.additionalLogos,
      chevronOverAvatar: action.payload.chevronOverAvatar,
      footerText: action.payload.footerText,
      stats: action.payload.stats,
      menuItems: action.payload.menuItems,
      failed: false,
      leaderboardApiUrl: action.payload.leaderboardApiUrl,
      loading: false,
      newsFeed: action.payload.newsFeed,
    };
  }
  // if community is not found or other error
  return {
    ...state,
    authorizedGroupIds: [],
    communityId: action.payload.error === '404' ? action.payload.communityId : null,
    communitySelector: [],
    groupId: '',
    logos: [],
    additionalLogos: [],
    menuItems: [],
    failed: action.payload.error === '404' ? action.payload.error : true,
    loading: false,
    cssUrl: null,
    leaderboardApiUrl: null,
  };
}

/**
 * Creates a new community meta reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return community meta reducer.
 */
function create(initialState) {
  return handleActions({
    [actions.tcCommunities.meta.mobileToggle](state) {
      return {
        ...state,
        isMobileOpen: !state.isMobileOpen,
      };
    },
    [actions.tcCommunities.meta.fetchDataInit](state) {
      return {
        ...state,
        communityId: null,
        communitySelector: [],
        logos: [],
        additionalLogos: [],
        menuItems: [],
        failed: false,
        loading: true,
        cssUrl: null,
        leaderboardApiUrl: null,
      };
    },
    [actions.tcCommunities.meta.fetchDataDone]: onDone,
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
  const subdomains = (req && req.subdomains) || [];
  if (subdomains.indexOf('wipro') >= 0) {
    return toFSA(actions.tcCommunities.meta.fetchDataDone('wipro'))
      .then(res => create(onDone({}, res)));
  }

  const match = req && req.url.match(/\/community\/([^/]+)\//);

  if (match) {
    const communityId = match[1];

    return toFSA(actions.tcCommunities.meta.fetchDataDone(communityId))
      .then(res => create(onDone({}, res)));
  }
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
