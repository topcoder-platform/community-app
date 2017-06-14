/**
 * Stats actions.
 */

import logger from 'utils/logger';
import { createActions } from 'redux-actions';
import { getService as getChallengeService } from 'services/challenges';
import { getService as getGroupService } from 'services/groups';

/**
 * Gets statistics related to the specified group. Data will be loaded into
 * stats.groups[groupId] path of the Redux state.
 * @param {String} groupId ID of the group.
 * @param {String} token V3 Topcoder auth token. It is necessary to get data
 *  related to private groups.
 * @return {Promise} Resolves to the loaded data.
 */
function getGroupStats(groupId, token) {
  /* TODO: At the moment, this component loads challenge objects to calculate
   * the number of challenges and the total prize. Probably in future, we'll
   * have a special API to get these data. Otherwise, we can try to reuse
   * the loading of challenges already implemented for challengeListing section
   * of the state. It would be more efficient (we can re-used loaded data),
   * but for now we follow the approach which is more simple technically. */
  const challengeService = getChallengeService(token);
  const groupService = getGroupService(token);
  return Promise.all([
    groupService.getMembers(groupId),
    challengeService.getChallenges({ groupIds: groupId, status: 'active' }),
    challengeService.getMarathonMatches({
      groupIds: groupId,
      status: 'active',
    }),
  ]).then(([members, challenges, mms]) => {
    if ((challenges.challenges.length < challenges.totalCount)
    || (mms.challenges.length < mms.totalCount)) {
      logger.error(`Total prize stats in the group ${groupId} is screwed, as there are too many active challenges to get them all in one pass!`);
    }
    /* NOTE: MMs objects do not include total prize data, so their prizes
     * are not include into the stats, at the moment. */
    const totalPrize = challenges.challenges
    .reduce((total, challenge) => total + challenge.totalPrize, 0);
    return {
      groupId,
      stats: {
        numChallenges: challenges.totalCount + mms.totalCount,
        numMembers: members.length,
        openPrizes: `$${totalPrize}`,
      },
    };
  });
}

export default createActions({
  STATS: {
    GET_GROUP_STATS: getGroupStats,
  },
});
