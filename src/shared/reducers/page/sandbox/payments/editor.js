/**
 * UI state reducer for the payment editor page.
 */

import _ from 'lodash';
import actions, { STATE } from 'actions/page/sandbox/payments/editor';
import { handleActions } from 'redux-actions';

/**
 * Initialize API request for member suggestions
 * @param {Object} state
 * @param {Array} action.payload Partial name
 * @return {Object} New state.
 */
function onGetMemberSuggestionsInit(state, { payload }) {
  return { ...state, getMemberSuggestionsForKeyword: payload };
}

/**
 * Finish API request for member suggestions
 * @param {Object} state
 * @param {Array} action.payload Array of potential member matches
 * @return {Object} New state.
 */
function onGetMemberSuggestionsDone(state, { payload }) {
  return { ...state, memberSuggestions: payload, getMemberSuggestionsForKeyword: '' };
}

/**
 * Sets visibility of member input search popup
 * @param {Object} state
 * @param {Boolean} action.payload If the popup is visible
 * @return {Object} New state.
 */
function onSetMemberInputPopupVisible(state, { payload }) {
  return { ...state, memberInputPopupVisible: payload };
}

/**
 * Sets the keyword/partial name that user has typed for Member
 * @param {Object} state
 * @param {String} action.payload Keyword/partial member name that user is typing
 * @return {Object} New state.
 */
function onSetMemberInputKeyword(state, { payload }) {
  return { ...state, memberInputKeyword: payload };
}

/**
 * Finish API request for member suggestions
 * @param {Object} state
 * @param {Object} action.payload Member that the user has selected
 * @return {Object} New state.
 */
function onSetMemberInputSelected(state, { payload }) {
  return { ...state, memberInputSelected: payload, memberInputKeyword: payload.handle };
}

/**
 * Selects the specified billing account.
 * @param {Object} state
 * @param {Number} action.payload Billing account ID.
 * @return {Object} New state.
 */
function onSelectBillingAccount(state, { payload }) {
  return { ...state, selectedBillingAccountId: payload };
}

/**
 * Selects the specified project.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onSelectProject(state, { payload }) {
  return { ...state, selectedProjectId: payload };
}

/**
 * Sets page state.
 * @param {Object} state Old Redux state.
 * @param {String} action.payload Target page state.
 * @return {Object} New Redux state.
 */
function onSetPageState(state, { payload }) {
  return { ...state, pageState: payload };
}

/**
 * Sets payment amount.
 * @param {Object} state
 * @param {Number} action.payload Payment amount.
 * @return {Object} New state.
 */
function onSetPaymentAmount(state, { payload }) {
  return { ...state, paymentAmount: payload };
}

/**
 * Sets the payment assignee.
 * @param {Object} state
 * @param {String} action.payload Payment assignee.
 * @return {Object} New state.
 */
function onSetPaymentAssignee(state, { payload }) {
  return { ...state, paymentAssignee: payload };
}

/**
 * Sets the payment description.
 * @param {Object} state
 * @param {String} action.payload
 * @return {Object} New state.
 */
function onSetPaymentDescription(state, { payload }) {
  return { ...state, paymentDescription: payload };
}

/**
 * Sets the payment title.
 * @param {Object} state
 * @param {String} action.payload
 * @return {Object} New state.
 */
function onSetPaymentTitle(state, { payload }) {
  return { ...state, paymentTitle: payload };
}

/**
 * Creates reducer with the specified initial state, or default state otherwise.
 * @param {Object} state Optional. Initial state. If not given, default state
 *  will be generated.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.page.sandbox.payments.editor;
  return handleActions({
    [a.getMemberSuggestionsInit]: onGetMemberSuggestionsInit,
    [a.getMemberSuggestionsDone]: onGetMemberSuggestionsDone,
    [a.setMemberInputPopupVisible]: onSetMemberInputPopupVisible,
    [a.setMemberInputKeyword]: onSetMemberInputKeyword,
    [a.setMemberInputSelected]: onSetMemberInputSelected,
    [a.selectBillingAccount]: onSelectBillingAccount,
    [a.selectProject]: onSelectProject,
    [a.setPageState]: onSetPageState,
    [a.setPaymentAmount]: onSetPaymentAmount,
    [a.setPaymentAssignee]: onSetPaymentAssignee,
    [a.setPaymentDescription]: onSetPaymentDescription,
    [a.setPaymentTitle]: onSetPaymentTitle,
  }, _.defaults(state, {
    getMemberSuggestionsForKeyword: '',
    memberSuggestions: [],
    memberInputPopupVisible: false,
    memberInputKeyword: '',
    memberInputSelected: {},
    pageState: STATE.NEW_PAYMENT,
    paymentAmount: 0,
    paymentAssignee: '',
    paymentDescription: '',
    paymentTitle: '',
    selectedBillingAccountId: 0,
    selectedProjectId: 0,
  }));
}

export default create();
