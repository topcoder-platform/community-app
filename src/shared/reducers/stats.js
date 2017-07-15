/**
 * Reducer for state.stats. That part of Redux state is intended to keep user-
 * and group-related statistics to render in the frontend.
 */

import _ from 'lodash';
import actions from 'actions/stats';
import logger from 'utils/logger';
import { handleActions } from 'redux-actions';

/**
 * Handles result of the getCommunityStats action.
 * @param {Object} state Previous state.
 * @param {Object} action Action result.
 * @return {Object} New state.
 */
function onGetCommunityStats(state, action) {
  if (action.error) {
    logger.error(action.payload);
    return state;
  }
  return {
    ...state,
    communities: {
      ...state.communities,
      [action.payload.communityId]: action.payload.stats,
    },
  };
}

/**
 * Creates a new Stats reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(initialState = {}) {
  const a = actions.stats;
  return handleActions({
    [a.getCommunityStats]: onGetCommunityStats,
  }, _.defaults(_.clone(initialState), {
    communities: {},
  }));
}

/**
 * The factory creates a new reducer with its initial state tailored to
 * the given ExpressJS HTTP request, if specified (for server-side rendering).
 * If no HTTP request is specified, it uses default initial state.
 */
export function factory() {
  /* Server-side rendering is not implemented yet. */
  return Promise.resolve(create());
}

/* Reducer with the default initial state. */
export default create();
