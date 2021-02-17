/**
 * Reducer for state.newsletterPreferences
 */

import actions from 'actions/newsletterPreferences';
import { handleActions } from 'redux-actions';

/**
 * Handles newsletterPreferences.fetchDataInit action.
 * @param {Object} state Previous state.
 * @param {Object} name The action.
 */
function onInit(state, { payload }) {
  return {
    ...state,
    email: payload,
    preferences: {},
    status: null,
    loading: true,
  };
}

/**
 * Handles newsletterPreferences.fetchDataDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onDone(state, { payload }) {
  return {
    ...state,
    preferences: payload.error ? null : payload.preferences,
    status: payload.error ? null : payload.status,
    error: payload.error,
    loading: false,
  };
}

function onUpdateTagInit(state) {
  return {
    ...state,
    updated: null,
  };
}

function onUpdateTagDone(state, { payload }) {
  // eslint-disable-next-line no-param-reassign
  state.preferences[payload.id] = payload.checked;
  return {
    ...state,
    updated: payload,
  };
}

/**
 * Creates newsletterPreferences reducer with the specified initial state.
 * @param {Object} state Optional. If not given, the default one is
 *  generated automatically.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  return handleActions({
    [actions.newsletterPreferences.fetchDataInit]: onInit,
    [actions.newsletterPreferences.fetchDataDone]: onDone,
    [actions.newsletterPreferences.updateTagInit]: onUpdateTagInit,
    [actions.newsletterPreferences.updateTagDone]: onUpdateTagDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();
