import _ from 'lodash';
import qs from 'qs';
import { createActions } from 'redux-actions';
import { getService as getGroupService } from 'services/groups';

/* global fetch */

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
  return fetch(`/api/tc-communities?${qs.stringify({ groups })}`)
  .then(res => (res.ok ? res.json() : new Error(res.statusText)));
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
