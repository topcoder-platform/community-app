/**
 * UI state reducer for the payment editor page.
 */

import _ from 'lodash';
import actions, { STATE } from 'actions/page/sandbox/payments/editor';
import { handleActions } from 'redux-actions';

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
    [a.selectBillingAccount]: onSelectBillingAccount,
    [a.selectProject]: onSelectProject,
    [a.setPageState]: onSetPageState,
    [a.setPaymentAmount]: onSetPaymentAmount,
    [a.setPaymentAssignee]: onSetPaymentAssignee,
    [a.setPaymentDescription]: onSetPaymentDescription,
    [a.setPaymentTitle]: onSetPaymentTitle,
  }, _.defaults(state, {
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
