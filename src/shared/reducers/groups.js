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

/**
 * Helper function for onGetDone(..). It recursively adds "srcGroup" and its
 * sub-groups (if any) into provide "groups" map, that will be modified.
 * @param {Object} groups
 * @param {Object} srcGroup
 * @return {Object} Modified "groups" object.
 */
function addGroup(groups, srcGroup) {
  const group = _.clone(srcGroup);
  if (group.subGroups) {
    if (group.subGroups.length) {
      group.subGroupIds = group.subGroups.map(g => g.id);
      group.subGroups.forEach(g => addGroup(groups, g));
    }
    delete group.subGroups;
  }
  groups[group.id] = group; // eslint-disable-line no-param-reassign
  return groups;
}

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

  let groups = state.groups;
  const loading = _.clone(state.loading);
  delete loading[groupId];

  if (error) {
    logger.error('Failed to load data for the group #', groupId, error);
    if (groups[groupId]) {
      groups = _.clone(groups);
      delete groups[groupId];
    }
  } else groups = addGroup(_.clone(groups), result);

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
 * Reducer factory.
 * @param {Object} req Optional. ExpressJS HTTP request. If provided, the
 *  intial state of the reducer will be tailored to the request.
 * @return {Promise} Resolves to the reducer.
 */
export function factory(req) {
  _.noop(req);
  return Promise.resolve(create());
}

/* Reducer with the default initial state. */
export default create();
