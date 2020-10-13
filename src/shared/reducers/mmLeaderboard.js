/**
 * Reducer for state.mmleaderboard
 */
import actions from 'actions/mmLeaderboard';
import { handleActions } from 'redux-actions';

/**
 * Handles getMmleaderboardInit action.
 * @param {Object} state Previous state.
 */
function onInit(state, { payload }) {
  return {
    ...state,
    [payload.id]: {
      loading: true,
    },
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
    [payload.id]: {
      loading: false,
      data: payload.data,
    },
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
    [actions.mmleaderboard.getMmlInit]: onInit,
    [actions.mmleaderboard.getMmlDone]: onDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();
