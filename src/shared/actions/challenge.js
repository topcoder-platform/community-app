/**
 * Challenge spcific actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getApiV2, getApiV3 } from '../services/api';

const apiV2 = auth => getApiV2(auth.tokenV2);
const apiV3 = auth => getApiV3(auth.tokenV3);

function fetchChallenge(tokens, challengeId) {
  return apiV3(tokens).fetch(`/challenges/?filter=id%3D${challengeId}`)
    .then(response => response.json())
    .then(response => response.result.content[0]);
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
