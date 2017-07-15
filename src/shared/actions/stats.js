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
function getCommunityStats(community, challenges, token) {
  /* TODO: At the moment, this component loads challenge objects to calculate
   * the number of challenges and the total prize. Probably in future, we'll
   * have a special API to get these data. */
  const filtered = _.filter(challenges, Filter.getFilterFunction(community.challengeFilter || {}));
  const totalPrize = filtered.reduce((total, challenge) => total + (challenge.totalPrize || 0), 0);
  const groupService = getGroupService(token);
  const groupId = community.challengeGroupId || community.groupId;
  const result = {
    communityId: community.communityId,
    stats: {
      numChallenges: filtered.length,
      numMembers: 0,
      openPrizes: `$${totalPrize.toLocaleString()}`,
    },
  };
  if (groupId) {
    return groupService.getMembers(community.challengeGroupId || community.groupId)
        .then((members) => {
          /* NOTE: MMs objects do not include total prize data, so their prizes
           * are not include into the stats, at the moment. */
          result.numChallenges = members.length;
          return result;
        }).catch(() => result);
  }
  return result;
}

export default createActions({
  STATS: {
    GET_COMMUNITY_STATS: getCommunityStats,
  },
});
