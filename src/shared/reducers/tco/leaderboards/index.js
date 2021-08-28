/**
 * Reducer for the TCO leaderboards component
 */

import actions from 'actions/tco/leaderboards';
import { redux } from 'topcoder-react-utils';

/**
 * Handles tcoLeaderboards.fetchLeaderboards action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onDone(state, action) {
  return {
    ...state,
    loading: false,
    leaderboards: action.payload,
  };
}


/**
 * Creates a new TCOLeaderboards reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return TCOLeaderboards reducer.
 */
function create(initialState) {
  return redux.handleActions({
    [actions.tcoLeaderboards.fetchLeaderboardsInit](state, action) {
      return {
        ...state,
        leaderboards: action.payload,
        loading: true,
      };
    },
    [actions.tcoLeaderboards.fetchLeaderboardsDone]: onDone,
  }, initialState || {});
}

/* Default reducer with empty initial state. */
export default create();
