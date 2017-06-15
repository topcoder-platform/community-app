import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService as getGroupService } from 'services/groups';

/**
 * Creates the action for joining the group.
 * @param {String} token Topcoder auth token V3.
 * @param {String} groupId
 * @param {String} memberId
 */
function joinDone(token, groupId, memberId) {
  const service = getGroupService(token);
  return service.addMember(groupId, memberId, 'user');
}

export default createActions({
  TC_COMMUNITY: {
    HIDE_JOIN_BUTTON: _.noop,
    JOIN_INIT: _.noop,
    JOIN_DONE: joinDone,
    RESET_JOIN_BUTTON: _.noop,
    SHOW_JOIN_CONFIRM_MODAL: _.noop,
  },
});
