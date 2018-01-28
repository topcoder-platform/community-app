/**
 * Challenge spcific actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService as getChallengesService } from 'services/challenges';
import { getApiV2 } from '../services/api';

/**
 * String values of valid tab names.
 */
export const DETAIL_TABS = {
  DETAILS: 'details',
  REGISTRANTS: 'registrants',
  CHECKPOINTS: 'checkpoints',
  SUBMISSIONS: 'submissions',
  WINNERS: 'winners',
  CHALLENGE_FORUM: 'challenge_forum',
};

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
  const v3Promise = service.getChallengeDetails(challengeId);
  return v3Promise;
}

/**
 * Payload creator for the action that initializes loading of user's submissions
 * to the specified challenges. This action also cancels any previous unfinished
 * fetching of submissions.
 * @param {String} challengeId
 * @return {String}
 */
function getSubmissionsInit(challengeId) {
  /* As a safeguard, we enforce challengeId to be string (in case somebody
   * passes in a number, by mistake). */
  return _.toString(challengeId);
}

/**
 * Payload creator for the action that actually pulls from API user's
 * submissions to the specified challenge.
 * @param {String} challengeId
 * @param {String} tokenV2
 */
function getSubmissionsDone(challengeId, tokenV2) {
  return getApiV2(tokenV2)
    .fetch(`/challenges/submissions/${challengeId}/mySubmissions`)
    .then(response => response.json())
    .then(response => ({
      challengeId: _.toString(challengeId),
      submissions: response.submissions,
    }))
    .catch((error) => {
      const err = { challengeId: _.toString(challengeId), error };
      throw err;
    });
}

/**
 * Registers user for the challenge.
 * @param {Object} auth Auth section of Redux state.
 * @param {String} challengeId
 * @return {Promise}
 */
function registerDone(auth, challengeId) {
  return getChallengesService(auth.tokenV3)
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
  return getChallengesService(auth.tokenV3)
    .unregister(challengeId)
    /* As a part of unregistration flow we silently update challenge details,
     * reusing for this purpose the corresponding action handler. */
    .then(() => getDetailsDone(challengeId, auth.tokenV3, auth.tokenV2));
}

/**
 * Initiates loading of challenge results. Any loading of results initiated
 * before will be silently discarded.
 * @param {Number|String} challengeId
 * @return {String}
 */
function loadResultsInit(challengeId) {
  return _.toString(challengeId);
}

/**
 * Loads challenge results. Challenge ID should match with the one previously
 * passed to loadResultsInit(..), otherwise results will be silently discarted.
 * @param {Object} auth
 * @param {Number|String} challengeId
 * @param {String} type
 * @return {Object}
 */
function loadResultsDone(auth, challengeId, type) {
  return getApiV2(auth.tokenV2)
    .fetch(`/${type}/challenges/result/${challengeId}`)
    .then(response => response.json())
    .then(response => ({
      challengeId: _.toString(challengeId),
      results: response.results,
    }));
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
    .then((response) => {
      // Expanded key is used for UI expand/collapse.
      response.checkpointResults.forEach((checkpoint, index) => {
        response.checkpointResults[index].expanded = false;
      });
      return {
        challengeId: Number(challengeId),
        checkpoints: response,
      };
    })
    .catch(error => ({
      error,
      challengeId: Number(challengeId),
    }));
}

/**
 * Toggles checkpoint feedback. If second argument is provided, it
 * will just open / close the checkpoint depending on its value being
 * true or false.
 * @param {Number} id
 * @param {Boolean} open
 * @return {Object}
 */
function toggleCheckpointFeedback(id, open) {
  return { id, open };
}

/**
 * Payload creator for the action that inits update of a challenge.
 * @param {String} uuid UUID of the operation (the same should be passed into
 *  the corresponding UPDATE_CHALLENGE_DONE action).
 * @return {String} UUID.
 */
function updateChallengeInit(uuid) {
  return uuid;
}

/**
 * Payload creator for the action that finalizes update of a challenge.
 * @param {String} uuid
 * @param {Object} challenge
 * @param {String} tokenV3
 */
function updateChallengeDone(uuid, challenge, tokenV3) {
  return getChallengesService(tokenV3).updateChallenge(challenge)
    .then(res => ({ uuid, res }));
}

export default createActions({
  CHALLENGE: {
    DROP_CHECKPOINTS: _.noop,
    DROP_RESULTS: _.noop,
    FETCH_CHECKPOINTS_INIT: _.noop,
    FETCH_CHECKPOINTS_DONE: fetchCheckpointsDone,
    GET_DETAILS_INIT: getDetailsInit,
    GET_DETAILS_DONE: getDetailsDone,
    GET_SUBMISSIONS_INIT: getSubmissionsInit,
    GET_SUBMISSIONS_DONE: getSubmissionsDone,
    LOAD_RESULTS_INIT: loadResultsInit,
    LOAD_RESULTS_DONE: loadResultsDone,
    REGISTER_INIT: _.noop,
    REGISTER_DONE: registerDone,
    SELECT_TAB: _.identity,
    TOGGLE_CHECKPOINT_FEEDBACK: toggleCheckpointFeedback,
    UNREGISTER_INIT: _.noop,
    UNREGISTER_DONE: unregisterDone,
    UPDATE_CHALLENGE_INIT: updateChallengeInit,
    UPDATE_CHALLENGE_DONE: updateChallengeDone,
  },
});
