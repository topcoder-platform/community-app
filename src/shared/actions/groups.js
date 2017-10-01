/**
 * Actions related to user groups.
 *
 * TODO: Some group-related actions can be found elsewhere (e.g. addition of
 * members to group is located inside tc-communities actions, because joining
 * a community is equivalent to adding user to a group). It will be great to
 * move such actions in here.
 */

import { createActions } from 'redux-actions';
import { getService } from 'services/groups';

/**
 * Payload creator for the action that removes from Redux store all loaded
 * group data, and cancels any on-going loading of user groups.
 */
function dropGroups() {
  return undefined;
}

/**
 * Payload creator for the action that initiates loading of the specified
 * groups.
 * @param {String|String[]} groupIds
 * @return {String|String[]}
 */
function getGroupsInit(groupIds) {
  return groupIds;
}

/**
 * Payload creator for the action that actually loads the specified groups.
 * Optionally, it allows to specify already known groups and groups being
 * loaded, to avoid unnecessary re-loading of already cached groups.
 * @param {String|String[]} groupIds
 * @param {String} tokenV3 Optional.
 * @return {Object} Group map for the loaded groups.
 */
function getGroupsDone(groupIds, tokenV3) {
  return getService(tokenV3).getGroupMap(groupIds);
}

export default createActions({
  GROUPS: {
    DROP_GROUPS: dropGroups,
    GET_GROUPS_INIT: getGroupsInit,
    GET_GROUPS_DONE: getGroupsDone,
  },
});
