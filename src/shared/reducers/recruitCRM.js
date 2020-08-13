/**
 * Reducer for state.recruit
 */

import actions from 'actions/recruitCRM';
import { handleActions } from 'redux-actions';

/**
 * Handles recruit.getJobsInit action.
 * @param {Object} state Previous state.
 */
function onInit(state) {
  return {
    ...state,
    jobs: {},
    loading: true,
  };
}

/**
 * Handles recruit.getJobsDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onDone(state, { payload }) {
  return {
    ...state,
    loading: false,
    jobs: payload.data,
  };
}

/**
 * Creates recruitCRM reducer with the specified initial state.
 * @param {Object} state Optional. If not given, the default one is
 *  generated automatically.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  return handleActions({
    [actions.recruit.getJobsInit]: onInit,
    [actions.recruit.getJobsDone]: onDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();
