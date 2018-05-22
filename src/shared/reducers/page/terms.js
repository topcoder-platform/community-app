/**
 * Reducer for state.terms.
 */

import _ from 'lodash';
import actions from 'actions/page/terms';
import { redux } from 'topcoder-react-utils';

/**
 * Opens the specified instance of terms modal + selects the terms to show in
 * there, although the exact functioning of that functionality was not
 * documented, thus has to be tracked.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onOpenTermsModal(state, action) {
  const { modalInstanceUuid } = action.payload;

  let { selectedTerm } = action.payload;
  if (!selectedTerm) {
    selectedTerm = _.find(state.terms, t => !t.agreed) || state.terms[0];
  }

  return {
    ...state,
    openTermsModalUuid: modalInstanceUuid,
    selectedTerm,
    viewOnly: Boolean(action.payload.selectedTerm),
  };
}

/**
 * Closes the specified terms modal, if necessary.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onCloseTermsModal(state, { payload }) {
  if (payload !== state.openTermsModalUuid
  && state.openTermsModalUuid !== 'ANY') return state;
  return { ...state, openTermsModalUuid: '' };
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
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for server-side rendering). If HTTP
 * request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory() {
  return redux.handleActions({
    [actions.terms.openTermsModal]: onOpenTermsModal,
    [actions.terms.closeTermsModal]: onCloseTermsModal,

    [actions.terms.selectTerm]: (state, { payload }) => ({ ...state, selectedTerm: payload }),
    [actions.terms.signDocu]: onSignDocu,
  }, {
    getTermsFailure: false,
    terms: [],
    openTermsModalUuid: '',
    selectedTerm: null,
    viewOnly: false,
    checkingStatus: false,
    checkStatusError: false,
    canRegister: false,
  });
}

/* Default reducer with empty initial state. */
export default factory();
