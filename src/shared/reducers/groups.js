/**
 * This reducer handles information related to user-groups.
 *
 * Corresponding segment of the Redux state is designed to have the following
 * fields:
 *
 * groups {Object} - Holds loaded information about user groups. Keys of this
 * object are group IDs, and the values are group data object. To keep the state
 * flat, and our code efficient; for any group that has sub-groups, subGroups
 * field is removed, while subGroupsIds {String[]} field is added, and each
 * sub group data object is added to the groups object.
 *
 * loading {Object} - Holds IDs of the groups being loaded. Removing ID from
 * this object will result in silent discard of the data loaded by the
 * corresponding GROUPS/GET_DONE action; though such functionality does
 * not look really necessary at the moment, thus we do not provide an
 * action to really cancel group loading.
 */

import _ from 'lodash';
import actions from 'actions/groups';
import { handleActions } from 'redux-actions';
import { getCommunityId } from 'routes/subdomains';
import { toFSA } from 'utils/redux';
import { getAuthTokens, getCommunitiesMetadata } from 'utils/tc';

/**
 * Private. Given two user group maps, it adds to "dst" the root group from
 * "src" (specified by "rootId"), and all its descendant groups. Any groups
 * in "src" not related to the sub-tree of the root group descendants are
 * not added to "dst".
 * This function mutates "dst"!
 * @param {Object} dst
 * @param {Object} src
 * @param {String} rootId
 */
function mergeGroupTree(dst, src, rootId) {
  const root = src[rootId];
  dst[rootId] = root; // eslint-disable-line no-param-reassign
  if (root.subGroupIds) {
    root.subGroupIds.forEach(id => mergeGroupTree(dst, src, id));
  }
}

/**
 * Removes from the state all loaded user groups, and cancels any on-going
 * loading of user groups.
 * @param {Object} state
 * @return {Object} New state.
 */
function onDropGroups(state) {
  return { ...state, groups: {}, loading: {} };
}

/**
 * Initiates the loading of data on the specified groups.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetGroupsInit(state, { payload }) {
  const groupIds = _.isArray(payload) ? payload : [payload];
  const loading = _.clone(state.loading);
  groupIds.forEach((id) => { loading[id] = true; });
  return { ...state, loading };
}

/**
 * Finalizes the loading of data on the specified groups.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetGroupsDone(state, action) {
  const groups = _.clone(state.groups);
  const loading = _.clone(state.loading);
  const loaded = action.payload;
  Object.values(loaded).forEach(({ id }) => {
    if (loading[id]) {
      mergeGroupTree(groups, loaded, id);
      delete loading[id];
    }
  });
  return { ...state, groups, loading };
}

/**
 * Creates groups reducer with the specified intial state.
 * @param {Object} state Optional. If not given, the empty state is assumed.
 * @return {Function} Reducer.
 */
function create(state) {
  const a = actions.groups;
  return handleActions({
    [a.dropGroups]: onDropGroups,
    [a.getGroupsInit]: onGetGroupsInit,
    [a.getGroupsDone]: onGetGroupsDone,
  }, _.defaults(state ? _.clone(state) : {}, {
    groups: {},
    loading: {},
  }));
}

/**
 * Loads into the state detailed information on the groups related to the
 * specified community.
 *
 * NOTE: This function is intended for the internal use only, it modifies
 * "state" argument!
 *
 * @param {String} communityId
 * @param {String} tokenV3
 * @param {Object} state
 * @return {Promise} Resolves to the resulting state.
 */
function loadCommunityGroups(communityId, tokenV3, state) {
  let res = _.defaults(state, { groups: {}, loading: {} });
  return getCommunitiesMetadata(communityId, tokenV3).then((data) => {
    let ids = data.authorizedGroupIds || [];
    if (data.groupIds) ids = ids.concat(data.groupIds);
    res = onGetGroupsInit(res, { payload: ids });
    return toFSA(actions.groups.getGroupsDone(ids, tokenV3))
      .then((action) => { res = onGetGroupsDone(res, action); })
      .then(() => res);
  });
}

/**
 * Reducer factory.
 * @param {Object} req Optional. ExpressJS HTTP request. If provided, the
 *  intial state of the reducer will be tailored to the request.
 * @return {Promise} Resolves to the reducer.
 */
export function factory(req) {
  if (req) {
    /* For any location within any TC community we should load detailed
     * information about any related user groups. */
    let communityId = getCommunityId(req.subdomains);
    if (!communityId && req.url.startsWith('/community')) {
      communityId = req.url.split('/')[2];
    }
    if (communityId) {
      const tokenV3 = getAuthTokens(req).tokenV3;
      return loadCommunityGroups(communityId, tokenV3, {})
        .then(res => create(res));
    }
  }
  return Promise.resolve(create());
}

/* Reducer with the default initial state. */
export default create();
