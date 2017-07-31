/**
 * Challenge spcific actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService as getChallengesService } from 'services/challenges';
import { getApiV2, getApiV3 } from '../services/api';

const apiV2 = auth => getApiV2(auth.tokenV2);
const apiV3 = auth => getApiV3(auth.tokenV3);

function fetchChallenge(auth, challengeId) {
  const endpoint = `/challenges/?filter=id%3D${challengeId}`;
  let apiV3UserDetail = Promise.resolve({});
  if (auth && auth.user && auth.user.handle) {
    const endpointWithMember = `/members/${auth.user.handle}${endpoint}`;
    apiV3UserDetail = apiV3(auth).fetch(endpointWithMember)
      .then(response => response.json())
      .then(response => response.result.content[0]);
  }
  const endpointV2 = `/challenges/${challengeId}`;
  const apiV3Promise = apiV3(auth).fetch(endpoint)
    .then(response => response.json())
    .then(response => response.result.content[0]);
  const apiV2Promise = apiV2(auth).fetch(endpointV2)
    .then(response => response.json());
  return Promise.all([apiV3Promise, apiV2Promise, apiV3UserDetail]);
}

function fetchSubmissions(tokens, challengeId) {
  return apiV2(tokens).fetch(`/challenges/submissions/${challengeId}/mySubmissions`)
    .then(response => response.json())
    .then(response => response.submissions);
}

/**
 * Registers user for the challenge.
 * @param {Object} auth Auth section of Redux state.
 * @param {String} challengeId
 * @return {Promise}
 */
function registerDone(auth, challengeId) {
  return getChallengesService(undefined, auth.tokenV2)
    .register(challengeId)
    /* As a part of registration flow we silently update challenge details,
     * reusing for this purpose the corresponding action handler. */
    .then(() => fetchChallenge(auth, challengeId));
}

/**
 * Unregisters user for the challenge.
 * @param {Object} auth Auth section of Redux state.
 * @param {String} challengeId
 * @return {Promise}
 */
function unregisterDone(auth, challengeId) {
  return getChallengesService(undefined, auth.tokenV2)
    .unregister(challengeId)
    /* As a part of unregistration flow we silently update challenge details,
     * reusing for this purpose the corresponding action handler. */
    .then(() => fetchChallenge(auth, challengeId));
}

export default createActions({
  /* TODO: Move these actions into the CHALLENGE object below. It does not make
   * any technical difference, but will lead to better action names displayed in
   * Redux dev tools, which is convenient. */
  FETCH_CHALLENGE_INIT: _.noop,
  FETCH_CHALLENGE_DONE: fetchChallenge,
  FETCH_SUBMISSIONS_INIT: _.noop,
  FETCH_SUBMISSIONS_DONE: fetchSubmissions,

  CHALLENGE: {
    REGISTER_INIT: _.noop,
    REGISTER_DONE: registerDone,
    UNREGISTER_INIT: _.noop,
    UNREGISTER_DONE: unregisterDone,
  },
});
