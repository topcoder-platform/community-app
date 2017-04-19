/**
 * Reducer for state.challenge
 */

import { combine, toFSA } from 'utils/redux';
import { handleActions } from 'redux-actions';
import challengeActions from 'actions/challenge';
import smpActions from 'actions/smp';
import mySubmissionsManagement from './my-submissions-management';

/**
 * Handles challengeActions.fetchChallengeDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onFetchChallengeDone(state, action) {
  return {
    ...state,
    details: action.error ? null : action.payload,
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
 * Creates a new Auth reducer with the specified initial state.
 * @param {Object} initialState Initial state.
 * @return Auth reducer.
 */
function create(initialState) {
  return handleActions({
    [challengeActions.fetchChallengeInit]: state => ({
      ...state,
      loadingDetails: true,
      fetchChallengeFailure: false,
      details: null,
    }),
    [challengeActions.fetchChallengeDone]: onFetchChallengeDone,
    [challengeActions.fetchSubmissionsInit]: state => ({
      ...state,
      loadingMySubmissions: true,
      mySubmissions: { v2: null },
    }),
    [challengeActions.fetchSubmissionsDone]: onFetchSubmissionsDone,

    // TODO: remove this reducer once the deleteSubmission action
    // in 'shared/actions/challenge' was fixed
    [smpActions.smp.deleteSubmissionDone]: (state, { payload }) => ({
      ...state,
      mySubmissions: { v2: state.mySubmissions.v2.filter(subm => (
          subm.submissionId !== payload
        )) },
    }),
  }, initialState || {});
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
  if (req && req.url.match(/^\/challenge\/\d+\/my-submissions/)) {
    const tokens = {
      tokenV2: req.cookies.tcjwt,
      tokenV3: req.cookies.tctV3,
    };
    const challengeId = req.url.match(/\d+/)[0];
    return Promise.all([
      toFSA(challengeActions.fetchChallengeDone(tokens, challengeId)),
      toFSA(challengeActions.fetchSubmissionsDone(tokens, challengeId)),
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
