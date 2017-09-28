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
 * Reducer factory.
 * @param {Object} req Optional. ExpressJS HTTP request. If provided, the
 *  intial state of the reducer will be tailored to the request.
 * @return {Promise} Resolves to the reducer.
 */
export function factory(/* req */) {
  return Promise.resolve(create());
}

/* Reducer with the default initial state. */
export default create();
