/**
 * Reducer for the community leaderboard page
 */

import actions from 'actions/leaderboard';
import { handleActions } from 'redux-actions';
import { toFSA } from 'utils/redux';

/**
 * Handles leaderboard.fetchLeaderboard action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onDone(state, action) {
  return {
    ...state,
    data: action.error ? null : action.payload,
    failed: action.error,
    loading: false,
  };
}

/**
 * Creates a new Leaderboard reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return Leaderboard reducer.
 */
function create(initialState) {
  return handleActions({
    [actions.leaderboard.fetchLeaderboardInit](state) {
      return {
        ...state,
        data: null,
        failed: false,
        loading: true,
      };
    },
    [actions.leaderboard.fetchLeaderboardDone]: onDone,
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
  /* Server-side rendering of Leaderboard Page. */
  if (req && req.url.match(/^\/leaderboard/)) {
    return toFSA(actions.leaderboard.fetchLeaderboardDone())
      .then(response => create(onDone({}, response)));
  }
  /* Otherwise this part of Redux state is initialized empty. */
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
