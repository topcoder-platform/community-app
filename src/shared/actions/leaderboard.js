/**
 * Leaderboard actions.
 */

/* global fetch */ /* eslint no-param-reassign: ["error", { "props": false }] */

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

function getTcoHistoryChallengesInit(url) {
  return _.toString(url);
}

async function getTcoHistoryChallengesDone(url, competitor) {
  const res = await fetch(url)
    .then(response => response.json())
    .then(jsonResponse => ({
      challenges: _.filter(jsonResponse, challenge => (
        challenge['tco_leaderboard.user_id']
          ? (challenge['tco_leaderboard.user_id'] === competitor['tco_leaderboard.user_id'])
          : (challenge.userid === competitor.userid)
      )),
    }));
  return res;
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
