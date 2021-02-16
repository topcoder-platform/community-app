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
    preferences: [],
    loading: true,
  };
}

/**
 * Handles newsletterPreferences.fetchDataDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onDone(state, { payload }) {
  const preferences = {};
  if (payload.preferences) {
    payload.preferences.forEach((record) => {
      preferences[record.name] = { ...record, checked: true };
    });
  }
  return {
    ...state,
    preferences: payload.error ? null : preferences,
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
  state.preferences[payload.id] = { name: payload.id, checked: payload.checked };
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
