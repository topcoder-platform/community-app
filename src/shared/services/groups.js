/**
 * Service for communication with group-related part of Topcoder API.
 */

import _ from 'lodash';
import logger from 'utils/logger';
import { getApiV3 } from './api';

/**
 * Private. Handles given response from the groups API.
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

/**
 * Private. Merges given user group (possibly a tree of user groups) into
 * groups map. This function intended only for internal use inside this module,
 * as it may mutate both arguments (hence, the corresponding ESLint rule is
 * disabled within this function), thus should be used only where it is safe.
 * For external use a similar function is provided by "utils/tc" module.
 * @param {Object} groups
 * @param {Object} group
 */
function mergeGroup(groups, group) {
  /* eslint-disable no-param-reassign */
  const sg = group.subGroups;
  group.timestamp = Date.now();
  if (sg && sg.length) {
    group.subGroupIds = sg.map(g => g.id);
    sg.forEach(g => mergeGroup(groups, g));
  }
  delete group.subGroups;
  groups[group.id] = group;
  /* eslint-enable no-param-reassign */
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
   *
   * Notice, when "withSubGroups" argument is true (default) this method returns
   * a tree of group data objects, connected via their "subGroups" fields.
   * getMap(..) method below wraps this functionality in a more practical way!
   *
   * @param {String} groupId
   * @param {Boolean} withSubGroups Optional. Defaults to true. Specifies,
   *  whether the response should information about sub-groups, if any.
   * @return {Promise} On success resolves to the group data object.
   */
  getGroup(groupId, withSubGroups = true) {
    let url = `/groups/${groupId}`;
    if (withSubGroups) {
      url = `${url}/getSubGroups?includeSubGroups=true&oneLevel=false`;
    }
    return this.private.api.get(url).then(handleApiResponse);
  }

  /**
   * Gets detailed information about the specified user group(s) and their
   * descendant sub-groups.
   *
   * @param {String|String[]} groupIds Group ID, or an array of group IDs,
   *  to query from Topcoder API.
   * @return {Promise} Resolves to the group map. That object will have group
   *  IDs as the keys, and corresponding group data objects as the values. In
   *  each group data object the "subGroups" field, if any, will be replaced by
   * "subGroupIds" (array of IDs of the immediate child groups), and the actual
   *  data on the sub-groups will be moved to the root of the map object.
   *  It also timestamps each fetched group.
   */
  getGroupMap(groupIds) {
    const res = {};
    const query = _.isArray(groupIds) ? groupIds : [groupIds];
    return Promise.all(query.map(id =>
      this.getGroup(id)
        .then(group => mergeGroup(res, group))
        .catch((err) => {
          /* In case we have failed to get some of the requested groups,
           * we just send error message to logs, and serve the result with
           * those groups that we managed to get. Otherwise it will be to
           * easy to break our code by minor mistakes in the group-related
           * configuration in the API and in the App. */
          logger.error(`Failed to get user group #${id}`);
          logger.error(err);

          /* Empty group with timestamp is added to the result, as we still
           * want to cache the result, even if the result is that we cannot
           * load this group, at least for this visitor. */
          res[id] = { id, timestamp: Date.now() };
        }),
    )).then(() => res);
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
  if (!lastInstance || tokenV3 !== lastInstance.private.tokenV3) {
    lastInstance = new GroupService(tokenV3);
  }
  return lastInstance;
}

export default undefined;
