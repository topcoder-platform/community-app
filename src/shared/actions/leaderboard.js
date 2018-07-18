/**
 * Leaderboard actions.
 */

/* global fetch */ /* eslint no-param-reassign: ["error", { "props": false }] */

import _ from 'lodash';
import { createActions } from 'redux-actions';

/**
 * Load user ranking for the leaderboard page.
 */
function fetchLeaderboard(auth, apiUrl) {
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
      return { data, loadedApiUrl: apiUrl };
    });
}

export default createActions({
  LEADERBOARD: {
    FETCH_LEADERBOARD_INIT: _.noop,
    FETCH_LEADERBOARD_DONE: fetchLeaderboard,
  },
});
