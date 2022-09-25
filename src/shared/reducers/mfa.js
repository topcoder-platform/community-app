/**
 * Reducer for dashboard
 */

import actions from 'actions/mfa';
import { handleActions } from 'redux-actions';
import { logger, errors } from 'topcoder-react-lib';
import _ from 'lodash';

/**
 * Handles USERMFA/GET_USER2FA_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onGetUser2faDone(state, { payload, error }) {
  if (error) {
    logger.error('Failed to get user 2fa settings', payload);
    errors.fireErrorMessage('Failed to get user 2fa settings', payload);
    return { ...state };
  }

  return ({
    ...state,
    user2fa: payload,
  });
}

/**
 * Handles USERMFA/UPDATE_USER2FA_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onUpdateUser2faDone(state, { payload, error }) {
  if (error) {
    logger.error('Failed to update user 2fa settings', payload);
    errors.fireErrorMessage('Failed to update user 2fa settings', payload);
    return { ...state };
  }

  return ({
    ...state,
    user2fa: payload,
    updatingUser2fa: false,
  });
}

/**
 * Handles USERMFA/UPDATE_USER_DICE_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onUpdateUserDiceDone(state, { payload, error }) {
  if (error) {
    logger.error('Failed to update user dice settings', payload);
    errors.fireErrorMessage('Failed to update user dice settings', payload);
    return { ...state };
  }

  return ({
    ...state,
    user2fa: payload,
  });
}

/**
 * Handles USERMFA/GET_NEW_DICE_CONNECTION_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onGetNewDiceConnectionDone(state, { payload, error }) {
  if (error) {
    logger.error('Failed to get new dice connection', payload);
    errors.fireErrorMessage('Failed to get new dice connection', payload);
    return { ...state };
  }

  return ({
    ...state,
    diceConnection: payload,
    gettingNewDiceConnection: false,
    diceConnectionError: false,
  });
}

/**
 * Handles USERMFA/GET_DICE_CONNECTION_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onGetDiceConnectionDone(state, { payload, error }) {
  if (error) {
    logger.error('Failed to get dice connection', payload);
    errors.fireErrorMessage('Failed to get dice connection', payload);
    return { ...state, diceConnectionError: true };
  }

  return ({
    ...state,
    diceConnection: payload,
    gettingDiceConnection: false,
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
    [a.getUser2faDone]: onGetUser2faDone,
    [a.updateUser2faInit]: state => ({ ...state, updatingUser2fa: true }),
    [a.updateUser2faDone]: onUpdateUser2faDone,
    [a.updateUserDiceDone]: onUpdateUserDiceDone,
    [a.getNewDiceConnectionInit]: state => (
      { ...state, diceConnection: {}, gettingNewDiceConnection: true }),
    [a.getNewDiceConnectionDone]: onGetNewDiceConnectionDone,
    [a.getDiceConnectionInit]: state => ({ ...state, gettingDiceConnection: true }),
    [a.getDiceConnectionDone]: onGetDiceConnectionDone,
  }, _.defaults(initialState, {
    user2fa: {},
    diceConnection: {},
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
