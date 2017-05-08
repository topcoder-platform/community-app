/**
 * Leaderboard actions.
 */

/* global fetch */ /* eslint no-param-reassign: ["error", { "props": false }] */

import _ from 'lodash';
import { createActions } from 'redux-actions';

/**
 * Temporary helper function used to update the mock data
 * which was missing some information.
 * TODO: Remove after switching to real API.
 */
function updateMockData(mockData) {
  mockData.forEach((element, index) => {
    // add ranking
    element.rank = index + 1;

    // add avatar (accounting for users who didn't set their avatar)
    const avatarChoices = [null, 'http://placehold.it/400x400'];
    element.avatarUrl = avatarChoices[Math.floor(Math.random() * avatarChoices.length)];

    // add number of challenge wins (as a function of points)
    element.wins = Math.ceil(element['project_result.final_score'] / 100);
  });

  return mockData;
}

/**
 * Load user ranking for the leaderboard page.
 * (mock data at the moment)
 */
function fetchLeaderboard() {
  return fetch('http://www.mocky.io/v2/59098e60100000b60747c10b')
    .then(response => response.json())
    .then(json => updateMockData(json));
}

export default createActions({
  LEADERBOARD: {
    FETCH_LEADERBOARD_INIT: _.noop,
    FETCH_LEADERBOARD_DONE: fetchLeaderboard,
  },
});
