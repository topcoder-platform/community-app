/**
 * Reducer for state.growSurf
 */
import _ from 'lodash';
import actions from 'actions/growSurf';
import { handleActions } from 'redux-actions';

/**
 * Handles getReferralIdInit action.
 * @param {Object} state Previous state.
 */
function onInit(state, { payload }) {
  return {
    ...state,
    ...payload,
  };
}

/**
 * Handles getReferralIdDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onDone(state, { payload }) {
  return {
    ...state,
    loading: false,
    data: payload.data,
    error: payload.error || false,
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
    [actions.growsurf.getReferralidInit]: onInit,
    [actions.growsurf.getReferralidDone]: onDone,
  }, _.defaults(state, {
    loading: false,
  }));
}

/* Reducer with the default initial state. */
export default create();
