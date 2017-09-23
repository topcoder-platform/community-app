/**
 * Reducer for scoreboard
 */

import actions from 'actions/tco/scoreboard';
import { handleActions } from 'redux-actions';
import { toFSA } from 'utils/redux';

/**
 * Handles scoreboard.fetchScoreboardDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onDone(state, action) {
  return {
    ...state,
    details: action.error ? null : action.payload,
    failed: action.error,
    loading: false,
  };
}

/**
 * Creates a new scoreboard reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return scoreboard reducer.
 */
function create(initialState) {
  return handleActions({
    [actions.scoreboard.fetchScoreboardInit](state) {
      return {
        ...state,
        details: null,
        failed: false,
        loading: true,
      };
    },
    [actions.scoreboard.fetchScoreboardDone]: onDone,
  }, initialState || {});
}

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for efficient server-side rendering).
 * If HTTP request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory(req) {
  if (req && req.url.endsWith('/scoreboard')) {
    return toFSA(actions.scoreboard.fetchScoreboardDone())
      .then(res => create(onDone({}, res)));
  }
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
