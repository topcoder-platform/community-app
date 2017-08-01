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
    element.photourl = avatarChoices[Math.floor(Math.random() * avatarChoices.length)];

    // add number of challenge wins (as a function of points)
    element['challenge.count'] = Math.ceil(element['project_result.final_score'] / 100);
  });

  return mockData;
}

/**
 * Load user ranking for the leaderboard page.
 */
function fetchLeaderboard(auth, apiUrl) {
  // if provided url is for demo
  // then we get data by simple fetch without authorization
  // TODO: remove this if when demo page is not needed anymore
  if (apiUrl.match('http://www.mocky.io')) {
    return fetch(apiUrl)
      .then(response => response.json())
      .then(json => updateMockData(json))
      .then(data => ({ data, loadedApiUrl: apiUrl }));
  }

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
