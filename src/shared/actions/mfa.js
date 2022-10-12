import { createActions } from 'redux-actions';
import { getService } from '../services/mfa';

/**
  * @static
  * @desc Creates an action that get user 2fa settings
  * @param {String} userId Operation User id.
  * @param {String} tokenV3 v3 auth token.
  * @return {Action}
  */
async function getUser2faDone(userId, tokenV3) {
  return getService(tokenV3).getUser2fa(userId);
}

/**
 * @static
 * @desc Creates an action that signals beginning of updating user 2fa settings.
 * @return {Action}
 */
function updateUser2faInit() { }

/**
 * @static
 * @desc Update user 2fa settings
 * @param {Number} userId User id.
 * @param {Boolean} mfaEnabled 2fa flag.
 * @return {Action}
 */
async function updateUser2faDone(userId, mfaEnabled, tokenV3) {
  return getService(tokenV3).updateUser2fa(userId, mfaEnabled);
}

/**
 * @static
 * @desc Update user dice settings
 * @param {Number} userId User id.
 * @param {Boolean} diceEnabled dice flag.
 * @return {Action}
 */
async function updateUserDiceDone(userId, diceEnabled, tokenV3) {
  return getService(tokenV3).updateUserDice(userId, diceEnabled);
}

/**
 * @static
 * @desc Creates an action that signals beginning of getting new dice connection
 * @return {Action}
 */
function getNewDiceConnectionInit() { }

/**
 * @static
 * @desc Get new Dice connection
 * @param {Number} userId User id.
 * @return {Action}
 */
async function getNewDiceConnectionDone(userId, tokenV3) {
  return getService(tokenV3).getNewDiceConnection(userId);
}

/**
 * @static
 * @desc Creates an action that signals beginning of getting dice connection
 * @return {Action}
 */
function getDiceConnectionInit() { }

/**
 * @static
 * @desc Get Dice connection
 * @param {Number} userId User id.
 * @param {Number} connectionId User id.
 * @return {Action}
 */
async function getDiceConnectionDone(userId, connectionId, tokenV3) {
  return getService(tokenV3).getDiceConnection(userId, connectionId);
}

export default createActions({
  USERMFA: {
    GET_USER2FA_DONE: getUser2faDone,
    UPDATE_USER2FA_INIT: updateUser2faInit,
    UPDATE_USER2FA_DONE: updateUser2faDone,
    UPDATE_USER_DICE_DONE: updateUserDiceDone,
    GET_NEW_DICE_CONNECTION_INIT: getNewDiceConnectionInit,
    GET_NEW_DICE_CONNECTION_DONE: getNewDiceConnectionDone,
    GET_DICE_CONNECTION_INIT: getDiceConnectionInit,
    GET_DICE_CONNECTION_DONE: getDiceConnectionDone,
  },
});
