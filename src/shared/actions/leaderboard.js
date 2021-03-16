/* eslint-disable no-param-reassign */
/**
 * Leaderboard actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';

/**
 * Load user ranking for the leaderboard page.
 */
function fetchLeaderboard(auth, apiUrl, id) {
  // we use fetch directly here, as we are making request to api v4 using token v3
  // so we don't create a new service to not bring inconsistency in an existent service approach
  return fetch(apiUrl, {
    headers: {
      Authorization: auth && auth.tokenV3 ? `Bearer ${auth.tokenV3}` : undefined,
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then((data) => {
      data.forEach(d => _.defaults(d, {
        'challenge_stats.winner_handle': d.handle,
        points: 0,
      }));
      data.sort((a, b) => b.points - a.points);
      // add rank field to data
      data.forEach((element, index) => {
        element.rank = index + 1;
      });
      return { data, id, loadedApiUrl: apiUrl };
    });
}

/**
 * Prepare loading looker for TCO history modal
 * @param {string} url the url to load data from
 */
function getTcoHistoryChallengesInit(url) {
  return _.toString(url);
}

/**
 * Loads looker for TCO history modal
 * @param {string} url the url to load data from
 * @param {object} competitor the competitor data
 */
async function getTcoHistoryChallengesDone(url, competitor) {
  const res = await fetch(url)
    .then(response => response.json())
    .then(jsonResponse => ({
      challenges: _.filter(jsonResponse, challenge => (
        challenge['member_profile_basic.user_id']
          ? (challenge['member_profile_basic.user_id'] === competitor['member_profile_basic.user_id'])
          : (challenge.userid === (competitor['member_profile_basic.user_id'] || competitor.userid))
      )),
    }));
  return {
    url,
    challenges: res.challenges,
  };
}

export default createActions({
  LEADERBOARD: {
    FETCH_LEADERBOARD_INIT: _.identity,
    FETCH_LEADERBOARD_DONE: fetchLeaderboard,
    GET_TCO_HISTORY_CHALLENGES_INIT: getTcoHistoryChallengesInit,
    GET_TCO_HISTORY_CHALLENGES_DONE: getTcoHistoryChallengesDone,
    RESET_TCO_HISTORY_CHALLENGES: _.noop,
  },
});
