/**
 * Reducer for state.challenge
 */

import _ from 'lodash';
import actions, { DETAIL_TABS } from 'actions/challenge';
import smpActions from 'actions/smp';
import logger from 'utils/logger';

import { handleActions } from 'redux-actions';
import { combine, toFSA } from 'utils/redux';
import { getAuthTokens } from 'utils/tc';
import { updateQuery } from 'utils/url';

import { fireErrorMessage } from 'utils/errors';

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
    fireErrorMessage('ERROR: Failed to load the challenge',
      'Please, try again a bit later');
    return {
      ...state,
      fetchChallengeFailure: action.error,
      loadingDetailsForChallengeId: '',
    };
  }

  const details = action.payload;
  if (_.toString(details.id) !== state.loadingDetailsForChallengeId) {
    return state;
  }

  return {
    ...state,
    details,
    fetchChallengeFailure: false,
    loadingDetailsForChallengeId: '',
  };
}

/**
 * Handles CHALLENGE/GET_SUBMISSION_INIT action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetSubmissionsInit(state, action) {
  return {
    ...state,
    loadingSubmissionsForChallengeId: action.payload,
    mySubmissions: { challengeId: '', v2: null },
  };
}

/**
 * Handles challengeActions.fetchSubmissionsDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onGetSubmissionsDone(state, action) {
  const { challengeId, error, submissions } = action.payload;
  if (challengeId !== state.loadingSubmissionsForChallengeId) return state;

  if (error) {
    logger.error(`Failed to get user's submissions for the challenge #${
      challengeId}`, error);
    return {
      ...state,
      loadingSubmissionsForChallengeId: '',
      mySubmissions: { challengeId: '', v2: null },
    };
  }

  return {
    ...state,
    loadingSubmissionsForChallengeId: '',
    mySubmissions: { challengeId, v2: submissions },
  };
}

/**
 * Handles challengeActions.fetchCheckpointsDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onFetchCheckpointsDone(state, action) {
  if (action.error) {
    return {
      ...state,
      loadingCheckpoints: false,
    };
  }
  if (state.details && state.details.id === action.payload.challengeId) {
    return {
      ...state,
      checkpoints: action.payload.checkpoints,
      loadingCheckpoints: false,
    };
  }
  return state;
}

/**
 * Handles CHALLENGE/LOAD_RESULTS_INIT action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
function onLoadResultsInit(state, { payload }) {
  return { ...state, loadingResultsForChallengeId: payload };
}

/**
 * Handles CHALLENGE/LOAD_RESULTS_DONE action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
function onLoadResultsDone(state, action) {
  if (action.payload.challengeId !== state.loadingResultsForChallengeId) {
    return state;
  }
  if (action.error) {
    logger.error(action.payload);
    return {
      ...state,
      loadingResultsForChallengeId: '',
      results: null,
      resultsLoadedForChallengeId: '',
    };
  }
  return {
    ...state,
    loadingResultsForChallengeId: '',
    results: action.payload.results,
    resultsLoadedForChallengeId: action.payload.challengeId,
  };
}

/**
 * Handles challengeActions.toggleCheckpointFeedback action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onToggleCheckpointFeedback(state, action) {
  const { payload: { id, open } } = action;
  const newCheckpointResults = _.clone(state.checkpoints.checkpointResults);
  newCheckpointResults[id].expanded = _.isUndefined(open)
    ? !newCheckpointResults[id].expanded : open;
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
    fireErrorMessage('ERROR: Failed to register for the challenge!');
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
    fireErrorMessage('ERROR: Failed to unregister for the challenge!');
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
 * Handles CHALLENGE/SELECT_TAB action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
function onSelectTab(state, { payload }) {
  updateQuery({ tab: payload });
  return { ...state, selectedTab: payload };
}

/**
 * Handles CHALLENGE/UPDATE_CHALLENGE_INIT.
 * @param {Object} state Old state.
 * @param {Object} actions Action.
 * @return {Object} New state.
 */
function onUpdateChallengeInit(state, { payload }) {
  return { ...state, updatingChallengeUuid: payload };
}

/**
 * Handles CHALLENGE/UPDATE_CHALLENGE_DONE.
 * @param {Object} state Old state.
 * @param {Object} actions Action.
 * @return {Object} New state.
 */
function onUpdateChallengeDone(state, { error, payload }) {
  if (error) {
    fireErrorMessage('Failed to save the challenge!', '');
    logger.error('Failed to save the challenge', payload);
    return state;
  }
  if (payload.uuid !== state.updatingChallengeUuid) return state;

  /* Due to the normalization of challenge APIs responses done when a challenge
   * is loaded, many pieces of our code expect different information in a format
   * different from API v3 response, thus if we just save entire payload.res
   * into the Redux state segment, it will break our app. As a rapid fix, let's
   * just save only the data which are really supposed to be updated in the
   * current use case (editing of challenge specs). */
  const res = _.pick(payload.res, [
    'detailedRequirements',
    'introduction',
    'round1Introduction',
    'round2Introduction',
    'submissionGuidelines',
  ]);

  return {
    ...state,
    details: {
      ...state.details,
      ...res,
    },
    updatingChallengeUuid: '',
  };
}

/**
 * Creates a new Auth reducer with the specified initial state.
 * @param {Object} initialState Initial state.
 * @return Auth reducer.
 */
function create(initialState) {
  const a = actions.challenge;
  return handleActions({
    [a.dropCheckpoints]: state => ({ ...state, checkpoints: null }),
    [a.dropResults]: state => ({ ...state, results: null }),
    [a.getDetailsInit]: onGetDetailsInit,
    [a.getDetailsDone]: onGetDetailsDone,
    [a.getSubmissionsInit]: onGetSubmissionsInit,
    [a.getSubmissionsDone]: onGetSubmissionsDone,
    [smpActions.smp.deleteSubmissionDone]: (state, { payload }) => ({
      ...state,
      mySubmissions: {
        ...state.mySubmissions,
        v2: state.mySubmissions.v2.filter(subm => (
          subm.submissionId !== payload
        )),
      },
    }),
    [a.registerInit]: state => ({ ...state, registering: true }),
    [a.registerDone]: onRegisterDone,
    [a.unregisterInit]: state => ({ ...state, unregistering: true }),
    [a.unregisterDone]: onUnregisterDone,
    [a.loadResultsInit]: onLoadResultsInit,
    [a.loadResultsDone]: onLoadResultsDone,
    [a.fetchCheckpointsInit]: state => ({
      ...state,
      checkpoints: null,
      loadingCheckpoints: true,
    }),
    [a.fetchCheckpointsDone]: onFetchCheckpointsDone,
    [a.toggleCheckpointFeedback]: onToggleCheckpointFeedback,
    [a.selectTab]: onSelectTab,
    [a.updateChallengeInit]: onUpdateChallengeInit,
    [a.updateChallengeDone]: onUpdateChallengeDone,
  }, _.defaults(initialState, {
    details: null,
    loadingCheckpoints: false,
    loadingDetailsForChallengeId: '',
    loadingResultsForChallengeId: '',
    mySubmissions: {},
    checkpoints: null,
    registering: false,
    results: null,
    resultsLoadedForChallengeId: '',
    unregistering: false,
    selectedTab: DETAIL_TABS.DETAILS,
    updatingChallengeUuid: '',
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
   * terms, etc. */
  if (req && req.url.match(/\/challenges\/\d{8}([?/].*)?$/)) {
    const tokens = getAuthTokens(req);
    const challengeId = req.url.match(/\d+/)[0];
    return toFSA(actions.challenge.getDetailsDone(challengeId, tokens.tokenV3, tokens.tokenV2))
      .then((details) => {
        const track = _.get(details, 'payload.track', '').toLowerCase();
        const checkpointsPromise = track === 'design' ? (
          toFSA(actions.challenge.fetchCheckpointsDone(
            tokens.tokenV2, challengeId))
        ) : null;
        const resultsPromise = _.get(details, 'payload.status', '') === 'COMPLETED' ? (
          toFSA(actions.challenge.loadResultsDone(tokens, challengeId, track))
        ) : null;
        return Promise.all([details, checkpointsPromise, resultsPromise]);
      }).then(([details, checkpoints, results]) => {
        let state = {
          loadingCheckpoints: true,
          loadingDetailsForChallengeId: challengeId,
          loadingResultsForChallengeId: challengeId,
        };
        if (req.query.tab) {
          state = onSelectTab(state, { payload: req.query.tab });
        }
        state = onGetDetailsDone(state, details);
        if (checkpoints) state = onFetchCheckpointsDone(state, checkpoints);
        if (results) state = onLoadResultsDone(state, results);
        return state;
      }).then(res => combine(create(res), { mySubmissionsManagement }));
  }

  if (req && req.url.match(/^\/challenges\/\d{8}\/my-submissions/)) {
    const tokens = getAuthTokens(req);
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
