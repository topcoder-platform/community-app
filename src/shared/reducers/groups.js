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
import logger from 'utils/logger';
import { handleActions } from 'redux-actions';
import { getCommunityId } from 'routes/subdomains';
import { toFSA } from 'utils/redux';
import { addGroup, getAuthTokens, getCommunitiesMetadata } from 'utils/tc';

/**
 * Initiates the loading of data on the specified group.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetInit(state, action) {
  const groupId = action.payload;
  if (state.loading[groupId]) return state;
  return { ...state, loading: { ...state.loading, [groupId]: true } };
}

/**
 * Finalizes the loading of data on the specified group.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetDone(state, action) {
  const { error, groupId, result } = action.payload;

  if (!state.loading[groupId]) return state;

  let groups = _.clone(state.groups);
  const loading = _.clone(state.loading);
  delete loading[groupId];

  if (error) {
    logger.error('Failed to load data for the group #', groupId, error);
    /* Empty group means that it is not known for API (or we failed to load it
     * for any other reason). Its presence in the state means, however, that we
     * have tried to load it, at least. */
    groups[groupId] = {};
  } else groups = addGroup(groups, result);

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
    [a.getInit]: onGetInit,
    [a.getDone]: onGetDone,
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
  return getCommunitiesMetadata(communityId).then((data) => {
    const ids = data.authorizedGroupIds || [];
    if (data.groupId) ids.push(data.groupId);
    ids.forEach((id) => { res.loading[id] = true; });
    return Promise.all(ids.map(id =>
      toFSA(actions.groups.getDone(id, tokenV3))
        .then((result) => { res = onGetDone(res, result); }),
    )).then(() => res);
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
