/**
 * Challenge spcific actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService as getChallengesService } from 'services/challenges';
import { decodeToken } from 'tc-accounts';
import { getApiV2 } from '../services/api';

/**
 * Payload creator for CHALLENGE/FETCH_DETAILS_INIT action,
 * which marks that we are about to fetch details of the specified challenge.
 * If any challenge details for another challenge are currently being fetched,
 * they will be silently discarted.
 * @param {Number|String} challengeId
 * @return {String}
 */
function getDetailsInit(challengeId) {
  return _.toString(challengeId);
}

/**
 * Payload creator for CHALLENGE/FETCH_DETAILS_DONE action,
 * which fetch details of the specified challenge.
 * @param {Number|String} challengeId
 * @param {String} tokenV3
 * @param {String} tokenV2
 * @return {Promise}
 */
function getDetailsDone(challengeId, tokenV3, tokenV2) {
  const service = getChallengesService(tokenV3, tokenV2);
  return Promise.all([
    service.getChallenges({ id: challengeId }).then(res => res.challenges[0]),
    getApiV2(tokenV2).fetch(`/challenges/${challengeId}`)
      .then(res => res.json()),
    tokenV3 && service.getUserChallenges(decodeToken(tokenV3).handle, {
      id: challengeId,
    }).then(res => res.challenges[0]),
  ]);
}

function getSubmissionsDone(challengeId, tokenV2) {
  return getApiV2(tokenV2).fetch(`/challenges/submissions/${challengeId}/mySubmissions`)
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
    .then(() => getDetailsDone(challengeId, auth.tokenV3, auth.tokenV2));
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
    .then(() => getDetailsDone(challengeId, auth.tokenV3, auth.tokenV2));
}

function fetchCheckpointsDone(tokenV2, challengeId) {
  const endpoint = `/design/challenges/checkpoint/${challengeId}`;
  return getApiV2(tokenV2).fetch(endpoint)
    .then((response) => {
      if (response.status !== 200) {
        throw response.status;
      } else {
        return response.json();
      }
    })
    .then(response => ({ checkpoints: response, challengeId }))
    .catch(error => ({ error, challengeId }));
}

export default createActions({
  CHALLENGE: {
    GET_DETAILS_INIT: getDetailsInit,
    GET_DETAILS_DONE: getDetailsDone,
    GET_SUBMISSIONS_INIT: _.noop,
    GET_SUBMISSIONS_DONE: getSubmissionsDone,
    REGISTER_INIT: _.noop,
    REGISTER_DONE: registerDone,
    UNREGISTER_INIT: _.noop,
    UNREGISTER_DONE: unregisterDone,
    FETCH_CHECKPOINTS_INIT: _.noop,
    FETCH_CHECKPOINTS_DONE: fetchCheckpointsDone,
  },
});
