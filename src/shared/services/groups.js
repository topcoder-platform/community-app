/**
 * Service for communication with group-related part of Topcoder API.
 *
 * NOTE: Through this file, and in related contexts, by loading a user group,
 * or user groups data, we refer to loading the information about descendant
 * user groups; i.e. given some user group(s) we speak about loading the sub-
 * three of related child groups.
 *
 * By group maps we refer to the object having group IDs as the keys, and
 * group data objects as the values. Any group object included into a group map
 * has its "subGroups" array (if present) replaced by "subGroupIds", that lists
 * only the IDs of immediate child groups; actual child group objects from
 * "subGroups" are recursively added to the top level of the group map.
 * Also each group in the group map is timestamped to keep caching of
 * the loaded data.
 */

import _ from 'lodash';
import logger from 'utils/logger';
import { utils } from 'topcoder-react-utils';
import { getApiV3 } from './api';

/* The value of USER_GROUP_MAXAGE constant converted to [ms]. */
const USER_GROUP_MAXAGE = utils.config.USER_GROUP_MAXAGE * 1000;

/**
 * Given an array of IDs (or a single ID) of user groups, and a map of known
 * user groups, it returns the array including all specified user groups, and
 * all their known descendant groups.
 * @param {String|String[]} groupIds
 * @param {Object} knownGroups
 * @return {String[]}
 */
export function addDescendantGroups(groupIds, knownGroups) {
  let res = _.isArray(groupIds) ? groupIds : [groupIds];
  const visitedGroupsIds = new Set();
  let pos = 0;
  while (pos < res.length) {
    const id = res[pos];
    if (!visitedGroupsIds.has(id)) {
      visitedGroupsIds.add(id);
      const g = knownGroups[id];
      if (g && g.subGroupIds) res = res.concat(g.subGroupIds);
    }
    pos += 1;
  }
  return _.uniq(res);
}

/**
 * Splits the given list of group IDs into the lists of groups being loaded,
 * loaded, and others.
 * @param {String|String[]} groupIds ID, or an array of IDs, of the group(s) we
 *  are interested in.
 * @param {Object} knownGroups Optional. The map of already known groups (some
 *  of them may be outdated, though). This should be of the same format as the
 *  object on "groups.groups" path of the Redux store. Defaults to empty object.
 * @param {Object} loadingGroups Optional. Set of groups beign loaded now. This
 *  should be of the same format as the object on "groups.loading" path of the
 *  Redux store. Defaults to empty object.
 * @return {Object} Resulting object may hold four arrays with group IDs from
 *  "groupIds" (empty arrays will not be included into the result object):
 *  - "loaded" - the groups that are present in "knownGroups" and are not
 *    outdated;
 *  - "loading" - the groups that are not present in "knownGroups" (or present,
 *    but outdated); but they are already being loaded;
 *  - "missing" - the groups that are not present in "knownGroups"
 *    (or outdated), and are not being loaded.
 *  - "unknown" - the groups that are absent in "knownGroups" map.
 */
export function checkGroupsStatus(groupIds, knownGroups = {}, loadingGroups = {}) {
  const loaded = [];
  const loading = [];
  const missing = [];
  const unknown = [];
  const now = Date.now();
  const tested = new Set();
  const ids = _.isArray(groupIds) ? groupIds : [groupIds];
  ids.forEach((id) => {
    if (tested.has(id)) return;
    tested.add(id);
    const g = knownGroups[id];
    if (!g) unknown.push(id);
    if (g && (now - g.timestamp || 0) < USER_GROUP_MAXAGE) loaded.push(id);
    else if (loadingGroups[id]) loading.push(id);
    else missing.push(id);
  });
  return {
    loaded: loaded.length ? loaded : null,
    loading: loading.length ? loading : null,
    missing: missing.length ? missing : null,
    unknown: unknown.length ? unknown : null,
  };
}

/**
 * Returns "true" if "userGroups" arrays includes any group specified by
 * "groupIds", or any group descendant from a group specified by "groupIds".
 * The is the map of known groups
 * @param {String|String[]} groupIds
 * @param {Object[]|String[]} userGroups Array of user's groups or their IDs.
 * @param {Object} knownGroups Map of known groups.
 * @return {Boolean}
 */
export function checkUserGroups(groupIds, userGroups, knownGroups) {
  const queue = _.isArray(groupIds) ? groupIds : [groupIds];
  if (!queue.length) return true;
  if (!userGroups.length) return false;

  /* Algorithmically, "knownGroups" stores, in compressed form, data on
   * known trees of user groups; and we want to check whether any of groups
   * from "userGroups" belong to sub-trees having groups from "groupIds" as
   * their roots. So, we do a breadth-frist search through the group trees. */
  const userGroupIds = new Set();
  const visitedGroupIds = new Set();
  userGroups.forEach(g => userGroupIds.add(_.isObject(g) ? g.id : g));
  let pos = 0;
  while (pos < queue.length) {
    const id = queue[pos];
    if (userGroupIds.has(id)) return true;
    visitedGroupIds.add(id);
    const g = knownGroups[id];
    if (g && g.subGroupIds) {
      g.subGroupIds.forEach(sgId => (
        !visitedGroupIds.has(sgId) ? queue.push(sgId) : null
      ));
    }
    pos += 1;
  }
  return false;
}


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
    const seen = new Set();
    const query = _.isArray(groupIds) ? groupIds : [groupIds];
    const promises = query.map((id) => {
      if (seen.has(id)) return null;
      seen.add(id);
      return this.getGroup(id)
        .then(group => mergeGroup(res, group))
        .catch((err) => {
          /* In case we have failed to get some of the requested groups,
          * we just send error message to logs, and serve the result with
          * those groups that we managed to get. Otherwise it will be to
          * easy to break our code by minor mistakes in the group-related
          * configuration in the API and in the App. */
          logger.error(`Failed to get user group #${id}`, err);

          /* Empty group with timestamp is added to the result, as we still
          * want to cache the result, even if the result is that we cannot
          * load this group, at least for this visitor. */
          res[id] = { id, timestamp: Date.now() };
        });
    });
    return Promise.all(promises).then(() => res);
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

  /**
   * Gets the number of members in the group.
   * @param {Number|String} groupId ID of the group.
   * @param {Boolean} withSubGroups Optional. When this flag is set, the count
   *  will include members of sub-groups of the specified group.
   * @return {Promise} Resolves to the members count.
   */
  async getMembersCount(groupId, withSubGroups) {
    let url = `/groups/${groupId}/membersCount`;
    if (withSubGroups) url += '?includeSubGroups=true';
    let res = await this.private.api.get(url);
    if (!res.ok) throw new Error(res.statusText);
    res = (await res.json()).result;
    if (!res.success) throw new Error(res.content);
    return Number(res.content);
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
