/**
 * Reducer for state.tcCommunities.meta
 */

import actions from 'actions/tc-communities/meta';
import { logger } from 'topcoder-react-lib';
import { getCommunityId } from 'server/services/communities';
import { actions as truActions, reducers, redux } from 'topcoder-react-utils';
import { getAuthTokens } from 'utils/tc';

const itemActions = truActions.item;
const itemReducer = reducers.item;

/**
 * Handles tcCommunities.meta.fetchDataDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onFetchDataDone(state, action) {
  if (action.error) {
    logger.error('Failed to load community meta-data!', action.payload);
    return state;
  }
  const a = redux.proxyAction(itemActions.loadDataDone, action);
  return itemReducer(state, a);
}

/**
 * Creates a new community meta reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return community meta reducer.
 */
function create(initialState = itemReducer(undefined, '@@INIT')) {
  const a = actions.tcCommunities.meta;
  return redux.handleActions({
    [a.mobileToggle](state) {
      return {
        ...state,
        isMobileOpen: !state.isMobileOpen,
      };
    },
    [a.fetchDataInit]:
      redux.proxyReducer(itemReducer, itemActions.loadDataInit),
    [a.fetchDataDone]: onFetchDataDone,
  }, initialState);
}

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for efficient server-side rendering).
 * If HTTP request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export async function factory(req) {
  if (req) {
    let communityId = getCommunityId(req.subdomains);
    if (!communityId && req.url.match(/\/__community__\/.*/)) {
      [,, communityId] = req.url.split('/');
      // remove possible params like ?join=<communityId>
      communityId = communityId ? communityId.replace(/\?.*/, '') : communityId;
    }
    if (communityId) {
      let state = itemReducer(undefined, '@@INIT');
      state = { ...state, loadingOperationId: communityId };
      const { tokenV3 } = getAuthTokens(req);
      let action = actions.tcCommunities.meta.fetchDataDone(communityId, tokenV3);
      action = await redux.resolveAction(action);
      return create(onFetchDataDone(state, action));
    }
  }
  return create();
}

/* Default reducer with empty initial state. */
export default create();
