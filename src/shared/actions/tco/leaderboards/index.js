/**
 * TCOLeaderboards actions.
 */

import { createActions } from 'redux-actions';
/**
 * Load leaderboards config and leaderboards
 */
function fetchLeaderboards(auth, config) {
  // we use fetch directly here, as we are making request to api v4 using token v3
  // so we don't create a new service to not bring inconsistency in an existent service approach
  return Promise.all(
    Object.values(config)
      .map(track => fetch(track.api, {
        headers: {
          Authorization: auth && auth.tokenV3 ? `Bearer ${auth.tokenV3}` : undefined,
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(leaderboard => ({ ...track, leaderboard }))),
  );
}

function fetchLeaderboardsInit(config) {
  return Object.values(config);
}


export default createActions({
  TCO_LEADERBOARDS: {
    FETCH_LEADERBOARDS_INIT: fetchLeaderboardsInit,
    FETCH_LEADERBOARDS_DONE: fetchLeaderboards,
  },
});
