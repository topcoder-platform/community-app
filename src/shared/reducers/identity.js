/**
 * Reducer for identity service
 */

import actions from 'actions/mfa';
import { handleActions } from 'redux-actions';
import { errors } from 'topcoder-react-lib';
import _ from 'lodash';

/**
 * Handles IDENTITY_SERVICE/UPDATE_PRIMARY_ROLE_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onUpdatePrimaryRoleDone(state, { payload, error }) {
  if (error) {
    errors.fireErrorMessage('Failed to update users primary role', payload.message);
    return { ...state, updatingPrimaryRole: false };
  }

  return ({
    ...state,
    updatingPrimaryRole: false,
  });
}

/**
 * Creates a new mfa reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return {Function} mfa reducer.
 */
function create(initialState) {
  const a = actions.usermfa;
  return handleActions({
    [a.updatePrimaryRoleInit]: state => ({ ...state, updatingPrimaryRole: true }),
    [a.updatePrimaryRoleDone]: onUpdatePrimaryRoleDone,
  }, _.defaults(initialState, {
    updatingPrimaryRole: false,
  }));
}

/**
 * Factory which creates a new reducer.
 * @return {Promise}
 * @resolves {Function(state, action): state} New reducer.
 */
export function factory() {
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
