/**
 * Stats actions.
 */

import _ from 'lodash';

import * as Filter from 'utils/challenge-listing/filter';
import { createActions } from 'redux-actions';
import { getService as getGroupService } from 'services/groups';

/**
 * Gets statistics related to the specified community. Data will be loaded into
 * stats.communities[communityId] path of the Redux state.
 * @param {Object} community details of the community.
 * @param {Array} challenges challenges from challengeListing to filter and do statistics
 * @param {String} token V3 Topcoder auth token. It is necessary to get data
 *  related to private groups.
 * @return {Promise} Resolves to the loaded data.
 */
/* TODO: This code should be moved to a dedicated service. */
function getCommunityStats(community, challenges, token) {
  /* TODO: At the moment, this component loads challenge objects to calculate
   * the number of challenges and the total prize. Probably in future, we'll
   * have a special API to get these data. */
  const filtered = _.filter(challenges, Filter.getFilterFunction(community.challengeFilter || {}));
  const totalPrize = filtered.reduce((total, challenge) => total + (challenge.totalPrize || 0), 0);
  const groupService = getGroupService(token);
  const result = {
    communityId: community.communityId,
    stats: {},
  };
  if (filtered.length) result.stats.numChallenges = filtered.length;
  if (totalPrize) result.stats.openPrizes = `$${totalPrize.toLocaleString()}`;
  if (community.groupIds && community.groupIds.length) {
    const members = new Set();
    return Promise.all(
      community.groupIds.map(id =>
        groupService.getMembers(id)
          .then(res => res.forEach((member) => {
            if (member.membershipType === 'user') members.add(member);
          })).catch(() => null),
      ),
    ).then(() => {
      if (members.size) result.stats.numMembers = members.size;
      return result;
    });
  }
  return result;
}

export default createActions({
  STATS: {
    GET_COMMUNITY_STATS: getCommunityStats,
  },
});
