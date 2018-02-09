/**
 * Actions related to the UI state of payment editor page.
 */

import { createActions } from 'redux-actions';
import { getService as getMembersService } from 'services/members';

export const STATE = {
  NEW_PAYMENT: 'NEW_PAYMENT',
  PAID: 'PAID',
  WAITING_PAYMENT_ACTIVATION: 'WAITING_PAYMENT_ACTIVATION',
  WAITING_PAYMENT_CLOSURE: 'WAITING_PAYMENT_CLOSURE',
  WAITING_PAYMENT_DRAFT: 'WAITING_PAYMENT_DRAFT',
};

/**
 * Payload creator for the action that starts member suggestion API call
 * @param {String} keyword Partial name/keyword
 * @return {String} Payload.
 */
function getMemberSuggestionsInit(keyword) {
  return keyword;
}

/**
 * Payload creator for the action that finishes member suggestion API call
 * @param {String} keyword Partial name/keyword
 * @return {Promise} Payload.
 */
function getMemberSuggestionsDone(keyword, tokenV3) {
  return getMembersService(tokenV3).getMemberSuggestions(keyword);
}

/**
 * Payload creator for the action that sets the member input search popup to visible
 * @param {Boolean} Visible
 * @return {Boolean} Payload.
 */
function setMemberInputPopupVisible(visible) {
  return visible;
}

/**
 * Payload creator for the action that sets the keyword/partial name that the user is typing
 * @param {String} keyword Partial member name
 * @return {String} Payload.
 */
function setMemberInputKeyword(keyword) {
  return keyword;
}

/**
 * Payload creator for the action that sets the currently selected member on the MemberInput
 * @param {String} keyword Partial member name
 * @return {String} Payload.
 */
function setMemberInputSelected(member) {
  return member;
}

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
          GET_MEMBER_SUGGESTIONS_INIT: getMemberSuggestionsInit,
          GET_MEMBER_SUGGESTIONS_DONE: getMemberSuggestionsDone,
          SET_MEMBER_INPUT_POPUP_VISIBLE: setMemberInputPopupVisible,
          SET_MEMBER_INPUT_KEYWORD: setMemberInputKeyword,
          SET_MEMBER_INPUT_SELECTED: setMemberInputSelected,
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
