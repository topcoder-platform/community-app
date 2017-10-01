import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService as getCommunitiesService } from 'services/communities';
import { getService as getGroupService } from 'services/groups';

/**
 * Creates the action for joining the group.
 * @param {String} token Topcoder auth token V3.
 * @param {String} groupId
 * @param {String} memberId
 */
/* TODO: Should be updated to add member to all groups related to the community.
 */
function joinDone(token, groupId, memberId) {
  const service = getGroupService(token);
  return service.addMember(groupId, memberId, 'user');
}

/**
 * Gets the listing of communities visible to the vistor: (1) all public
 * communities; (2) if the visitor is an authenticated user, then also
 * communities he is member of.
 * @param {Object} auth
 * @return {Promise}
 */
function getList(auth) {
  let groups = [];
  if (auth.profile && auth.profile.groups) {
    groups = auth.profile.groups.map(g => g.id);
  }
  return getCommunitiesService(auth.tokenV3).getList(groups);
}

export default createActions({
  TC_COMMUNITY: {
    GET_LIST: getList,
    HIDE_JOIN_BUTTON: _.noop,
    JOIN_INIT: _.noop,
    JOIN_DONE: joinDone,
    RESET_JOIN_BUTTON: _.noop,
    SHOW_JOIN_CONFIRM_MODAL: _.noop,
  },
});
