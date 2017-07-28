/**
 * Challenge spcific actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getApiV2, getApiV3 } from '../services/api';

const apiV2 = auth => getApiV2(auth.tokenV2);
const apiV3 = auth => getApiV3(auth.tokenV3);

function fetchChallenge(tokens, challengeId) {
  const endpoint = `/challenges/?filter=id%3D${challengeId}`;
  let apiV3UserDetail = Promise.resolve({});
  if (tokens && tokens.user && tokens.user.handle) {
    const endpointWithMember = `/members/${tokens.user.handle}${endpoint}`;
    apiV3UserDetail = apiV3(tokens).fetch(endpointWithMember)
      .then(response => response.json())
      .then(response => response.result.content[0]);
  }
  const endpointV2 = `/challenges/${challengeId}`;
  const apiV3Promise = apiV3(tokens).fetch(endpoint)
    .then(response => response.json())
    .then(response => response.result.content[0]);
  const apiV2Promise = apiV2(tokens).fetch(endpointV2)
    .then(response => response.json());
  return Promise.all([apiV3Promise, apiV2Promise, apiV3UserDetail]);
}

function fetchSubmissions(tokens, challengeId) {
  return apiV2(tokens).fetch(`/challenges/submissions/${challengeId}/mySubmissions`)
    .then(response => response.json())
    .then(response => response.submissions);
}

export default createActions({
  FETCH_CHALLENGE_INIT: _.noop,
  FETCH_CHALLENGE_DONE: fetchChallenge,

  FETCH_SUBMISSIONS_INIT: _.noop,
  FETCH_SUBMISSIONS_DONE: fetchSubmissions,
});
