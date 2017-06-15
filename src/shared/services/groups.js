/**
 * Service for communication with group-related part of Topcoder API.
 */

import { getApiV3 } from './api';

class GroupService {

  /**
   * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
   */
  constructor(tokenV3) {
    this.private = {
      api: getApiV3(tokenV3),
      tokenV3,
    };
  }

  /**
   * Adds new member to the group.
   * @param {String} groupId
   * @param {String} memberId
   * @param {String} membershipType
   * @return {Promise}
   */
  addMember(groupId, memberId, membershipType) {
    return this.private.api.postJson(`/groups/${groupId}/members`, {
      param: { memberId, membershipType },
    }).then(res => (res.ok ? res.json() : new Error(res.statusText)))
    .then(res => (
      res.result.status === 200
      ? res.result.content
      : new Error(res.result.content)
    ));
  }

  /**
   * Gets group members.
   * @param {String} groupId
   * @return {Promise} On sucess resolves to the array of member objects,
   *  which include user IDs, membership time, and some bookkeeping data.
   */
  getMembers(groupId) {
    return this.private.api.get(`/groups/${groupId}/members`)
    .then(res => (res.ok ? res.json() : new Error(res.statusText)))
    .then(res => (
      res.result.status === 200
      ? res.result.content
      : new Error(res.result.content)
    ));
  }
}

/**
 * Returns a new or existing instance of challenge service, which works with
 * the specified auth token.
 * @param {String} tokenV3 Optional. Topcoder API v3 auth token.
 * @return {GroupService} Instance of the service.
 */
let lastInstance = null;
export function getService(tokenV3) {
  if (!lastInstance || tokenV3 !== lastInstance.tokenV3) {
    lastInstance = new GroupService(tokenV3);
  }
  return lastInstance;
}

export default undefined;
