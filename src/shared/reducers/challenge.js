/**
 * Reducer for state.challenge
 */

import { combine, toFSA } from 'utils/redux';
import { handleActions } from 'redux-actions';
import actions from 'actions/challenge';
import smpActions from 'actions/smp';
import logger from 'utils/logger';
import mySubmissionsManagement from './my-submissions-management';

/**
 * Handles challengeActions.fetchChallengeDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onFetchChallengeDone(state, action) {
  return {
    ...state,
    details: action.error ? null : action.payload[2] || action.payload[0],
    detailsV2: action.error ? null : action.payload[1],
    fetchChallengeFailure: action.error || false,
    loadingDetails: false,
  };
}

/**
 * Handles challengeActions.fetchSubmissionsDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onFetchSubmissionsDone(state, action) {
  return {
    ...state,
    fetchMySubmissionsFailure: action.error || false,
    loadingMySubmissions: false,
    mySubmissions: { v2: action.error ? [] : action.payload },
  };
}

/**
 * Handles CHALLENGE/REGISTER_DONE action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
function onRegisterDone(state, action) {
  if (action.error) {
    logger.error('Failed to register for the challenge!', action.payload);
    return { ...state, registering: false };
  }
  /* As a part of registration flow we silently update challenge details,
   * reusing for this purpose the corresponding action handler. Thus, we
   * should also reuse corresponding reducer to generate proper state. */
  return onFetchChallengeDone({ ...state, registering: false }, action);
}

/**
 * Handles CHALLENGE/UNREGISTER_DONE action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
function onUnregisterDone(state, action) {
  if (action.error) {
    logger.error('Failed to register for the challenge!', action.payload);
    return { ...state, unregistering: false };
  }
  /* As a part of unregistration flow we silently update challenge details,
   * reusing for this purpose the corresponding action handler. Thus, we
   * should also reuse corresponding reducer to generate proper state. */
  return onFetchChallengeDone({ ...state, unregistering: false }, action);
}

/**
 * Creates a new Auth reducer with the specified initial state.
 * @param {Object} initialState Initial state.
 * @return Auth reducer.
 */
function create(initialState) {
  const a = actions.challenge;
  return handleActions({
    [actions.fetchChallengeInit]: state => ({
      ...state,
      loadingDetails: true,
      fetchChallengeFailure: false,
      details: null,
    }),
    [actions.fetchChallengeDone]: onFetchChallengeDone,
    [actions.fetchSubmissionsInit]: state => ({
      ...state,
      loadingMySubmissions: true,
      mySubmissions: { v2: null },
    }),
    [actions.fetchSubmissionsDone]: onFetchSubmissionsDone,
    [smpActions.smp.deleteSubmissionDone]: (state, { payload }) => ({
      ...state,
      mySubmissions: { v2: state.mySubmissions.v2.filter(subm => (
        subm.submissionId !== payload
      )) },
    }),
    [a.registerInit]: state => ({ ...state, registering: true }),
    [a.registerDone]: onRegisterDone,
    [a.unregisterInit]: state => ({ ...state, unregistering: true }),
    [a.unregisterDone]: onUnregisterDone,
  }, initialState || {
    registering: false,
    unregistering: false,
  });
}

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for server-side rendering). If HTTP
 * request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory(req) {
  /* Server-side rendering of Submission Management Page. */
  if (req && req.url.match(/^\/challenges\/\d+\/my-submissions/)) {
    const tokens = {
      tokenV2: req.cookies.tcjwt,
      tokenV3: req.cookies.v3jwt,
    };
    const challengeId = req.url.match(/\d+/)[0];
    return Promise.all([
      toFSA(actions.fetchChallengeDone(tokens, challengeId)),
      toFSA(actions.fetchSubmissionsDone(tokens, challengeId)),
    ]).then(([challenge, submissions]) => {
      const state = onFetchChallengeDone({}, challenge);
      return onFetchSubmissionsDone(state, submissions);
    }).then(state => combine(create(state), { mySubmissionsManagement }));
  }
  /* Otherwise this part of Redux state is initialized empty. */
  return Promise.resolve(combine(create(), { mySubmissionsManagement }));
}

/* Default reducer with empty initial state. */
export default combine(create(), { mySubmissionsManagement });
