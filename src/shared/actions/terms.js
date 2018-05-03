/**
 * Terms specific actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { actions } from 'topcoder-react-lib';

/**
 * Payload creator for the action that opens the specified terms modal.
 * @param {String} modalInstanceUuid ID of the terms modal instance to be
 *  opened. Any other instances of terms modals present in the page will be
 *  closed automatically by this action, as it is not safe to open multiple
 *  modals, (and makes no sense in current implementation).
 * @param {???} selectedTerm Optional. Selected term. It was not documented by
 *  author of related code, thus the exact value is not clear.
 * @return {Object} Action payload.
 */
function openTermsModal(modalInstanceUuid, selectedTerm) {
  return { modalInstanceUuid, selectedTerm };
}

/**
 * Payload creator for the action that closes the specified terms modal.
 * @param {String} modalInstanceUuid ID of the terms modal instance to be
 *  closed. If another terms modal is open, it won't be affected.
 * @return {String} Action payload.
 */
function closeTermsModal(modalInstanceUuid) {
  return modalInstanceUuid;
}

export default _.merge({ terms: actions.terms }, createActions({
  TERMS: {
    OPEN_TERMS_MODAL: openTermsModal,
    CLOSE_TERMS_MODAL: closeTermsModal,

    SELECT_TERM: _.identity,
    SIGN_DOCU: _.identity,
  },
}));
