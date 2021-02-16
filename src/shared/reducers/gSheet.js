/**
 * Reducer for state.gSheet
 */
import actions from 'actions/gSheet';
import { handleActions } from 'redux-actions';

/**
 * Handles getMmleaderboardInit action.
 * @param {Object} state Previous state.
 */
function onInit(state, { payload }) {
  return {
    ...state,
    [`${payload.id}-${payload.index}`]: {},
  };
}

/**
 * Handles getMmleaderboardDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onDone(state, { payload }) {
  return {
    ...state,
    [`${payload.id}-${payload.index}`]: payload.data,
  };
}

/**
 * Creates mmleaderboard reducer with the specified initial state.
 * @param {Object} state Optional. If not given, the default one is
 *  generated automatically.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  return handleActions({
    [actions.gsheets.getGsheetInit]: onInit,
    [actions.gsheets.getGsheetDone]: onDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();
