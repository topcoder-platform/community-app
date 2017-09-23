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

/* This pair of action creators allows to load detailed information about the
 * specified user group. This information includes data on the sub-groups, thus
 * related actions effective load entire tree of groups descendant from the
 * specified one.
 *
 * Related segment of the Redux state is designed to keep information about
 * many user groups at once. Thus, loading data about new groups does not drop
 * previously loaded data on other groups (but, if previously loaded group is
 * loaded again, related data are properly updated). Also, all requests to load
 * user group data are handled in parallel, and new requests do not cancel
 * previous ones, even if they have no been finished yet. */

/**
 * Initiates loading of the user group data. Created action writes groupId into
 * Redux state for book-keeping purposes. This action does not cancel previous
 * unfinished requests to load group data.
 * @param {String} groupId
 * @return {String}
 */
function getInit(groupId) {
  return groupId;
}

/**
 * Actually loads user group data. Note that a proper v3 auth token is necessary
 * to get user group data.
 * @param {String} groupId
 * @param {String} tokenV3
 * @return {Object}
 */
function getDone(groupId, tokenV3) {
  return getService(tokenV3).get(groupId)
    .then(result => ({ groupId, result }))
    .catch(error => ({ groupId, error }));
}

export default createActions({
  GROUPS: {
    GET_INIT: getInit,
    GET_DONE: getDone,
  },
});
