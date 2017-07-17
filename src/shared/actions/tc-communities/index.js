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
 * Gets from the backend challenge filters for public communities, and for
 * the communities the authenticated user has access to.
 * NOTE: At the moment it works with a mocked API.
 * @param {Object} auth Optional
 * @return {Promise}
 */
function getCommunityFilters(auth) {
  let groups = [];
  if (auth.profile && auth.profile.groups) {
    groups = auth.profile.groups.map(g => g.id);
  }
  return fetch(`/api/tc-communities?${qs.stringify({ groups })}`)
  .then(res => (res.ok ? res.json() : new Error(res.statusText)));
}

/**
 * Gets from the backend all of available communities
 * NOTE: At the moment it works with a mocked API.
 * @return {Promise}
 */
function getCommunityList() {
  return fetch('/api/tc-communities?listAll=true')
    .then(res => (res.ok ? res.json() : new Error(res.statusText)));
}

export default createActions({
  TC_COMMUNITY: {
    HIDE_JOIN_BUTTON: _.noop,
    JOIN_INIT: _.noop,
    JOIN_DONE: joinDone,
    RESET_JOIN_BUTTON: _.noop,
    SHOW_JOIN_CONFIRM_MODAL: _.noop,
    GET_COMMUNITY_FILTERS: getCommunityFilters,
    GET_COMMUNITY_LIST: getCommunityList,
  },
});
