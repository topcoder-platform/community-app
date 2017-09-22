/**
 * Service for communication with group-related part of Topcoder API.
 */

import { getApiV3 } from './api';

/**
 * Handles given response from the groups API.
 * @param {Object} response
 * @return {Promise} On success resolves to the data fetched from the API.
 */
function handleApiResponse(response) {
  if (!response.ok) throw new Error(response.statusText);
  return response.json().then(({ result }) => {
    if (result.status !== 200) throw new Error(result.content);
    return result.content;
  });
}

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
    }).then(handleApiResponse);
  }

  /**
   * Gets detailed information about the group.
   * @param {String} groupId
   * @param {Boolean} withSubGroups Optional. Defaults to true. Specifies,
   *  whether the response should information about sub-groups, if any.
   * @return {Promise} On success resolves to the group data object.
   */
  get(groupId, withSubGroups = true) {
    let url = `/groups/${groupId}`;
    if (withSubGroups) {
      url = `${url}/getSubGroups?includeSubGroups=true&oneLevel=false`;
    }
    return this.private.api.get(url).then(handleApiResponse);
  }

  /**
   * Gets group members.
   * @param {String} groupId
   * @return {Promise} On sucess resolves to the array of member objects,
   *  which include user IDs, membership time, and some bookkeeping data.
   */
  getMembers(groupId) {
    return this.private.api.get(`/groups/${groupId}/members`)
      .then(handleApiResponse);
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
