/**
 * Reducer for state.challenge
 */

import _ from 'lodash';
import { combine, toFSA } from 'utils/redux';
import { handleActions } from 'redux-actions';
import actions from 'actions/challenge';
import smpActions from 'actions/smp';
import logger from 'utils/logger';
import mySubmissionsManagement from './my-submissions-management';

/**
 * Handles CHALLENGE/GET_DETAILS_INIT action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state
 */
function onGetDetailsInit(state, action) {
  const challengeId = action.payload;
  return state.details && _.toString(state.details.id) !== challengeId ? {
    ...state,
    fetchChallengeFailure: false,
    loadingDetailsForChallengeId: challengeId,
    details: null,
    detailsV2: null,
  } : {
    ...state,
    fetchChallengeFailure: false,
    loadingDetailsForChallengeId: challengeId,
  };
}

/**
 * Handles CHALLENGE/GET_DETAILS_DONE action.
 * Note, that it silently discards received details if the ID of received
 * challenge mismatches the one stored in loadingDetailsForChallengeId field
 * of the state.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetDetailsDone(state, action) {
  if (action.error) {
    logger.error('Failed to get challenge details!', action.payload);
    return {
      ...state,
      details: null,
      detailsV2: null,
      fetchChallengeFailure: action.error,
      loadingDetailsForChallengeId: '',
    };
  }

  /* If action was fired for authenticated visitor, payload[2] will contain
   * details fetched specifically for the user (thus may include additional
   * data comparing to the standard API v3 response for the challenge details,
   * stored in payload[0]). */
  const details = action.payload[2] || action.payload[0];
  if (_.toString(details.id) !== state.loadingDetailsForChallengeId) {
    return state;
  }

  return {
    ...state,
    details,
    detailsV2: action.payload[1],
    fetchChallengeFailure: false,
    loadingDetailsForChallengeId: '',
  };
}

/**
 * Handles challengeActions.fetchSubmissionsDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onGetSubmissionsDone(state, action) {
  return {
    ...state,
    fetchMySubmissionsFailure: action.error || false,
    loadingMySubmissions: false,
    mySubmissions: { v2: action.error ? [] : action.payload },
  };
}

/**
 * Handles challengeActions.fetchCheckpointsDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onFetchCheckpointsDone(state, action) {
  if (action.payload.error) {
    return {
      ...state,
      loadingCheckpoints: false,
    };
  }
  if ((state.details && state.details.id === action.payload.challengeId) ||
    (state.detailsV2 && state.detailsV2.challengeId === action.payload.challengeId)) {
    return {
      ...state,
      checkpoints: action.payload.checkpoints,
      loadingCheckpoints: false,
    };
  }
  return state;
}
/**
 * Handles challengeActions.toggleCheckpointFeedback action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onToggleCheckpointFeedback(state, action) {
  const newCheckpointResults = state.checkpoints.checkpointResults.map((result, index) => ({
    ...result,
    expanded: index === action.payload ? !result.expanded : result.expanded,
  }));
  const newCheckpoints = {
    ...state.checkpoints,
    checkpointResults: newCheckpointResults,
  };
  return {
    ...state,
    checkpoints: newCheckpoints,
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
  return onGetDetailsDone({
    ...state,
    registering: false,
    loadingDetailsForChallengeId: _.toString(state.details.id),
  }, action);
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
  return onGetDetailsDone({
    ...state,
    unregistering: false,
    loadingDetailsForChallengeId: _.toString(state.details.id),
  }, action);
}

/**
 * Creates a new Auth reducer with the specified initial state.
 * @param {Object} initialState Initial state.
 * @return Auth reducer.
 */
function create(initialState) {
  const a = actions.challenge;
  return handleActions({
    [a.getDetailsInit]: onGetDetailsInit,
    [a.getDetailsDone]: onGetDetailsDone,
    [a.getSubmissionsInit]: state => ({
      ...state,
      loadingMySubmissions: true,
      mySubmissions: { v2: null },
    }),
    [a.getSubmissionsDone]: onGetSubmissionsDone,
    [smpActions.smp.deleteSubmissionDone]: (state, { payload }) => ({
      ...state,
      mySubmissions: {
        v2: state.mySubmissions.v2.filter(subm => (
          subm.submissionId !== payload
        )),
      },
    }),
    [a.registerInit]: state => ({ ...state, registering: true }),
    [a.registerDone]: onRegisterDone,
    [a.unregisterInit]: state => ({ ...state, unregistering: true }),
    [a.unregisterDone]: onUnregisterDone,
    [a.loadResultsInit]: state => ({
      ...state,
      loadingResults: true,
    }),
    [a.loadResultsDone]: (state, action) => ({
      ...state,
      loadingResults: false,
      results: action.error ? null : action.payload,
    }),
    [a.fetchCheckpointsInit]: state => ({
      ...state,
      checkpoints: null,
      loadingCheckpoints: true,
    }),
    [a.fetchCheckpointsDone]: onFetchCheckpointsDone,
    [a.toggleCheckpointFeedback]: onToggleCheckpointFeedback,
    [a.openTermsModal]: state => ({ ...state, showTermsModal: true }),
    [a.closeTermsModal]: state => ({ ...state, showTermsModal: false }),
  }, _.defaults(initialState, {
    details: null,
    detailsV2: null,
    loadingCheckpoints: false,
    loadingDetailsForChallengeId: '',
    checkpoints: null,
    registering: false,
    unregistering: false,
    showTermsModal: false,
  }));
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

  /* TODO: This shares some common logic with the next "if" block, which
   * should be re-used there. */
  /* TODO: For completely server-side rendering it is also necessary to load
   * terms, results, etc. */
  if (req && req.url.match(/^\/challenges\/\d+$/)) {
    const tokens = {
      tokenV2: req.cookies.tcjwt,
      tokenV3: req.cookies.v3jwt,
    };
    const challengeId = req.url.match(/\d+/)[0];
    return toFSA(actions.challenge.getDetailsDone(challengeId, tokens.tokenV3, tokens.tokenV2))
      .then((details) => {
        if (details.payload[0].track === 'DESIGN') {
          return toFSA(actions.challenge.fetchCheckpointsDone(tokens.tokenV2, challengeId))
            .then(checkpoints => ({ details, checkpoints }));
        }
        return { details, checkpoints: null };
      }).then((res) => {
        let state = {
          loadingDetailsForChallengeId: challengeId,
          loadingCheckpoints: true,
        };
        state = onGetDetailsDone(state, res.details);
        if (res.checkpoints) {
          state = onFetchCheckpointsDone(state, res.checkpoints);
        }
        return combine(create(state), { mySubmissionsManagement });
      });
  }

  if (req && req.url.match(/^\/challenges\/\d+\/my-submissions/)) {
    const tokens = {
      tokenV2: req.cookies.tcjwt,
      tokenV3: req.cookies.v3jwt,
    };
    const challengeId = req.url.match(/\d+/)[0];
    return Promise.all([
      toFSA(actions.challenge.getDetailsDone(challengeId, tokens.tokenV3, tokens.tokenV2)),
      toFSA(actions.challenge.getSubmissionsDone(challengeId, tokens.tokenV3, tokens.tokenV2)),
    ]).then(([challenge, submissions]) => {
      const state = onGetDetailsDone({}, challenge);
      return onGetSubmissionsDone(state, submissions);
    }).then(state => combine(create(state), { mySubmissionsManagement }));
  }
  /* Otherwise this part of Redux state is initialized empty. */
  return Promise.resolve(combine(create(), { mySubmissionsManagement }));
}

/* Default reducer with empty initial state. */
export default combine(create(), { mySubmissionsManagement });
