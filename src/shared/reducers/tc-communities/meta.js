/**
 * Reducer for state.tcCommunities.meta
 */

import _ from 'lodash';
import actions from 'actions/tc-communities/meta';
import logger from 'utils/logger';
import { handleActions } from 'redux-actions';
import { getCommunityId } from 'routes/subdomains';
import { toFSA } from 'utils/redux';
import { getAuthTokens } from 'utils/tc';

/**
 * Handles tcCommunities.meta.fetchDataDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onDone(state, action) {
  if (action.error) {
    logger.error('Failed to load community meta-data!', action.payload);
    return state;
  } else if (action.payload.communityId
    !== state.loadingMetaDataForCommunityId) {
    return state;
  }
  return {
    ...state,
    data: action.payload,
    lastUpdateOfMetaData: Date.now(),
    loadingMetaDataForCommunityId: '',
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
    [actions.tcCommunities.meta.fetchDataInit](state, action) {
      return {
        ...state,
        loadingMetaDataForCommunityId: action.payload,
      };
    },
    [actions.tcCommunities.meta.fetchDataDone]: onDone,
  }, _.defaults(initialState || {}, {
    data: {},
    lastUpdateOfMetaData: 0,
    loadingMetaDataForCommunityId: '',
  }));
}

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for efficient server-side rendering).
 * If HTTP request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory(req) {
  if (req) {
    let communityId = getCommunityId(req.subdomains);
    if (!communityId && req.url.startsWith('/community')) {
      communityId = req.url.split('/')[2];
    }
    if (communityId) {
      const state = { loadingMetaDataForCommunityId: communityId };
      const tokenV3 = getAuthTokens(req).tokenV3;
      return toFSA(
        actions.tcCommunities.meta.fetchDataDone(communityId, tokenV3),
      ).then(res => create(onDone(state, res)));
    }
  }
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
