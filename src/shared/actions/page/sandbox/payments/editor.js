/**
 * Actions related to the UI state of payment editor page.
 */

import { createActions } from 'redux-actions';

export const STATE = {
  NEW_PAYMENT: 'NEW_PAYMENT',
  PAID: 'PAID',
  WAITING: 'WAITING',
};

/**
 * Payload creator for the action that selects the specified billing account.
 * @param {Number} accountId
 * @return {Number} Payload.
 */
function selectBillingAccount(accountId) {
  return accountId;
}

/**
 * Payload creator for the action that selects the specified project.
 * @param {String} projectId
 * @return {String} Action payload.
 */
function selectProject(projectId) {
  return projectId;
}

/**
 * Payload creator for the action that switches page states. See STATE enum.
 * @param {String} state
 * @return {String}
 */
function setPageState(state) {
  return state;
}

/**
 * Payload creator for the action that sets the payment amount.
 * @param {Number} amount Payment amount in USD.
 * @return {Number}
 */
function setPaymentAmount(amount) {
  return amount;
}

/**
 * Payload creator for the action that sets the payment assignee.
 * @param {String} username
 * @return {String}
 */
function setPaymentAssignee(username) {
  return username;
}

/**
 * Payload creator for the action that sets the payment description.
 * @param {String} description
 * @return {String} Action payload.
 */
function setPaymentDescription(description) {
  return description;
}

/**
 * Payload creator for the action that sets the payment title.
 * @param {String} title
 * @return {String} Action payload.
 */
function setPaymentTitle(title) {
  return title;
}

export default createActions({
  PAGE: {
    SANDBOX: {
      PAYMENTS: {
        EDITOR: {
          SELECT_BILLING_ACCOUNT: selectBillingAccount,
          SELECT_PROJECT: selectProject,
          SET_PAGE_STATE: setPageState,
          SET_PAYMENT_AMOUNT: setPaymentAmount,
          SET_PAYMENT_ASSIGNEE: setPaymentAssignee,
          SET_PAYMENT_DESCRIPTION: setPaymentDescription,
          SET_PAYMENT_TITLE: setPaymentTitle,
        },
      },
    },
  },
});
