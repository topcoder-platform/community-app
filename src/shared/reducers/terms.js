/**
 * Reducer for state.terms.
 */

import _ from 'lodash';
import actions from 'actions/terms';
import logger from 'utils/logger';
import { handleActions } from 'redux-actions';
import { toFSA } from 'utils/redux';

/**
 * Handles TERMS/GET_TERMS_DONE action.
 * Note, that it silently discards received terms if the challengeId of received
 * mismatches the one stored in loadingTermsForChallengeId field
 * of the state.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetTermsDone(state, action) {
  if (action.error) {
    logger.error('Failed to get challenge terms!', action.payload);
    return {
      ...state,
      terms: [],
      getTermsFailure: action.error,
      loadingTermsForChallengeId: '',
    };
  }

  if (_.toString(action.payload.challengeId) !== state.loadingTermsForChallengeId) {
    return state;
  }

  return {
    ...state,
    ...action.payload,
    getTermsFailure: false,
    loadingTermsForChallengeId: '',
  };
}

function onGetTermDetailsDone(state, action) {
  if (action.error) {
    logger.error('Failed to get term details!', action.payload);
    return {
      ...state,
      details: null,
      getTermDetailsFailure: action.error,
      loadingDetailsForTermId: '',
    };
  }

  if (_.toString(action.payload.termId) !== state.loadingDetailsForTermId) {
    return state;
  }

  return {
    ...state,
    ...action.payload,
    getTermDetailsFailure: false,
    loadingDetailsForTermId: '',
  };
}

function onGetDocuSignUrlDone(state, action) {
  if (action.error) {
    logger.error('Failed to get docu sign url!', action.payload);
    return {
      ...state,
      docuSignUrl: '',
      getDocuSignUrlFailure: action.error,
      loadingDocuSignUrl: '',
    };
  }

  if (_.toString(action.payload.templateId) !== state.loadingDocuSignUrl) {
    return state;
  }
  return {
    ...state,
    ...action.payload,
    getDocuSignUrlFailure: false,
    loadingDocuSignUrl: '',
  };
}

function onAgreeTermDone(state, action) {
  if (action.error) {
    logger.error('Failed to agree term!', action.payload);
    return {
      ...state,
      agreeTermFailure: action.error,
      agreeingTerm: '',
    };
  }

  if (_.toString(action.payload.termId) !== state.agreeingTerm) {
    return state;
  }
  return {
    ...state,
    agreedTerms: {
      ...state.agreedTerms,
      [action.payload.termId]: action.payload.success,
    },
    agreeTermFailure: false,
    agreeingTerm: '',
  };
}

/**
 * Creates a new Terms reducer with the specified initial state.
 * @param {Object} initialState Initial state.
 * @return Terms reducer.
 */
function create(initialState) {
  return handleActions({
    [actions.terms.getTermsInit]: (state, { payload }) => ({
      ...state,
      getTermsFailure: false,
      loadingTermsForChallengeId: payload,
      terms: [],
      challengeId: payload,
    }),
    [actions.terms.getTermsDone]: onGetTermsDone,
    [actions.terms.getTermDetailsInit]: (state, { payload }) => ({
      ...state,
      getTermDetailsFailure: false,
      loadingDetailsForTermId: payload,
      details: null,
      termId: payload,
    }),
    [actions.terms.getTermDetailsDone]: onGetTermDetailsDone,
    [actions.terms.getDocuSignUrlInit]: (state, { payload }) => ({
      ...state,
      getDocuSignUrlFailure: false,
      loadingDocuSignUrl: payload,
      docuSignUrl: '',
      templateId: payload,
    }),
    [actions.terms.getDocuSignUrlDone]: onGetDocuSignUrlDone,
    [actions.terms.agreeTermInit]: (state, { payload }) => ({
      ...state,
      agreeTermFailure: false,
      agreeingTerm: payload,
    }),
    [actions.terms.agreeTermDone]: onAgreeTermDone,
  }, initialState || {
    getTermsFailure: false,
    terms: [],
    agreedTerms: {},
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
  if (req && req.url.match(/^\/challenges\/\d+/)) {
    const tokenV2 = req.cookies.tcjwt;
    const challengeId = req.url.match(/\d+/)[0];
    return toFSA(actions.terms.getTermsDone(challengeId, tokenV2)).then((result) => {
      const state = onGetTermsDone({}, result);
      return create(state);
    });
  }
  /* Otherwise this part of Redux state is initialized empty. */
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
