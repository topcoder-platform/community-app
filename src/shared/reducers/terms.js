/**
 * Reducer for state.terms.
 */

import _ from 'lodash';
import actions from 'actions/terms';
import { getCommunityId } from 'server/services/communities';
import logger from 'utils/logger';
import { handleActions } from 'redux-actions';
import { toFSA } from 'utils/redux';
import { getAuthTokens } from 'utils/tc';

/**
 * sort terms by agreed status
 * @param  {Array} terms terms to sort
 * @return {Array}       sorted terms
 */
function sortTerms(terms) {
  return _.sortBy(terms, t => (t.agreed ? 0 : 1));
}

/**
 * Handles TERMS/GET_TERMS_DONE action.
 * Note, that it silently discards received terms if the entity of received data
 * mismatches the one stored in loadingTermsForEntity
 * of the state.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetTermsDone(state, action) {
  if (action.error) {
    logger.error('Failed to get terms!', action.payload);
    return {
      ...state,
      terms: [],
      getTermsFailure: action.error,
      loadingTermsForEntity: null,
    };
  }

  if (!_.isEqual(action.payload.entity, state.loadingTermsForEntity)) {
    return state;
  }

  return {
    ...state,
    entity: action.payload.entity,
    terms: sortTerms(action.payload.terms),
    getTermsFailure: false,
    loadingTermsForEntity: null,
  };
}

/**
 * Handles TERMS/GET_TERMS_INIT action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetTermsInit(state, action) {
  return {
    ...state,
    getTermsFailure: false,
    loadingTermsForEntity: action.payload,
    terms: [],
    entity: action.payload,
  };
}

/**
 * Handles TERMS/GET_TERM_DETAILS_DONE action.
 * Note, that it silently discards received details if the termId of received
 * mismatches the one stored in loadingDetailsForTermId field
 * of the state.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetTermDetailsDone(state, action) {
  if (action.error) {
    logger.error('Failed to get term details!', action.payload);
    return {
      ...state,
      details: null,
      getTermDetailsFailure: action.payload,
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

/**
 * Handles TERMS/GET_DOCU_SIGN_URL_DONE action.
 * Note, that it silently discards received url if the templateId of received
 * mismatches the one stored in loadingDocuSignUrl field
 * of the state.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetDocuSignUrlDone(state, action) {
  if (action.error) {
    logger.error('Failed to get docu sign url!', action.payload);
    return {
      ...state,
      docuSignUrl: '',
      getDocuSignUrlFailure: action.payload,
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

/**
 * Handles TERMS/AGREE_TERM_DONE action.
 * Note, that it silently discards received result if the termId of received
 * mismatches the one stored in agreeingTerm field
 * of the state.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onAgreeTermDone(state, action) {
  if (action.error) {
    logger.error('Failed to agree term!', action.payload);
    return {
      ...state,
      agreeTermFailure: action.payload,
      agreeingTerm: '',
    };
  }

  if (_.toString(action.payload.termId) !== state.agreeingTerm) {
    return state;
  }
  if (action.payload.success) {
    const terms = _.cloneDeep(state.terms);
    const term = _.find(terms, ['termsOfUseId', action.payload.termId]);
    term.agreed = true;
    const selectedTerm = _.find(terms, t => !t.agreed);
    return {
      ...state,
      terms,
      selectedTerm,
      agreeTermFailure: false,
      agreeingTerm: '',
    };
  }
  return {
    ...state,
    agreeTermFailure: false,
    agreeingTerm: '',
  };
}

/**
 * Handles TERMS/OPEN_TERMS_MODAL action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onOpenTermsModal(state, action) {
  if (action.payload) {
    return {
      ...state,
      showTermsModal: true,
      selectedTerm: action.payload,
      viewOnly: true,
    };
  }
  const selectedTerm = _.find(state.terms, t => !t.agreed) || state.terms[0];
  return {
    ...state,
    showTermsModal: true,
    selectedTerm,
    viewOnly: false,
  };
}

/**
 * Handles TERMS/SIGN_DOCU action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onSignDocu(state, action) {
  const terms = _.cloneDeep(state.terms);
  const term = _.find(terms, ['termsOfUseId', action.payload]);
  term.agreed = true;
  const selectedTerm = _.find(terms, t => !t.agreed);
  return {
    ...state,
    terms,
    selectedTerm,
  };
}

/**
 * Handles TERMS/CHECK_STATUS_DONE action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onCheckStatusDone(state, action) {
  if (action.error) {
    logger.error('Check terms status failed!', action.payload);
    return {
      ...state,
      checkingStatus: false,
      checkStatusError: action.payload,
      canRegister: false,
    };
  }
  const canRegister = _.every(action.payload, 'agreed');
  const selectedTerm = _.find(action.payload, t => !t.agreed);
  return {
    ...state,
    checkingStatus: false,
    checkStatusError: false,
    canRegister,
    terms: sortTerms(action.payload),
    selectedTerm,
  };
}


/**
 * Creates a new Terms reducer with the specified initial state.
 * @param {Object} initialState Initial state.
 * @return Terms reducer.
 */
function create(initialState) {
  return handleActions({
    [actions.terms.getTermsInit]: onGetTermsInit,
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
    [actions.terms.openTermsModal]: onOpenTermsModal,
    [actions.terms.closeTermsModal]: state => ({ ...state, showTermsModal: false }),
    [actions.terms.selectTerm]: (state, { payload }) => ({ ...state, selectedTerm: payload }),
    [actions.terms.signDocu]: onSignDocu,
    [actions.terms.checkStatusInit]: state => ({
      ...state,
      checkingStatus: true,
    }),
    [actions.terms.checkStatusDone]: onCheckStatusDone,
  }, initialState || {
    getTermsFailure: false,
    terms: [],
    showTermsModal: false,
    selectedTerm: null,
    viewOnly: false,
    checkingStatus: false,
    checkStatusError: false,
    canRegister: false,
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
  if (req) {
    const tokens = getAuthTokens(req);
    let entity;

    // if it's challenge details page
    if (req.url.match(/^\/challenges\/\d+/)) {
      const challengeId = req.url.match(/\d+/)[0];
      entity = { type: 'challenge', id: challengeId };
    }

    // if it's commynity page
    let communityId = getCommunityId(req.subdomains);
    if (!communityId && req.url.match(/\/community\/.*/)) {
      [,, communityId] = req.url.split('/');
      // remove possible params like ?join=<communityId>
      communityId = communityId ? communityId.replace(/\?.*/, '') : communityId;
    }
    if (!entity && communityId) {
      entity = { type: 'community', id: communityId };
    }

    // load terms for the entity
    if (entity) {
      return toFSA(actions.terms.getTermsDone(entity, tokens)).then((termsDoneAction) => {
        // we have to init first, otherwise results will be ignored by onGetTermsDone
        let state = onGetTermsInit({}, actions.terms.getTermsInit(entity));
        state = onGetTermsDone(state, termsDoneAction);

        // if we try to join community automatically, but not all terms are agreed,
        // then we show terms modal (also we make sure is logged in before open)
        if (tokens.tokenV3 && req.query.join && !_.every(termsDoneAction.payload.terms, 'agreed')) {
          state = onOpenTermsModal(state, actions.terms.openTermsModal());
        }

        return create(state);
      });
    }
  }
  /* Otherwise this part of Redux state is initialized empty. */
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
