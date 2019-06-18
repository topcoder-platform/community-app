/**
 * Reducer for state.newsletterArchive
 */

import actions from 'actions/newsletterArchive';
import { handleActions } from 'redux-actions';

/**
 * Handles newsletterArchive.fetchDatInit action.
 * @param {Object} state Previous state.
 * @param {Object} name The action.
 */
function onInit(state, { payload }) {
  return {
    ...state,
    [payload]: {
      archive: [],
      loading: true,
    },
  };
}

/**
 * Handles newsletterArchive.fetchDataDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onDone(state, { payload }) {
  return {
    ...state,
    [payload.name]: {
      archive: payload.error ? null : payload.archive,
      error: payload.error,
      loading: false,
    },
  };
}

/**
 * Creates newsletterArchive reducer with the specified initial state.
 * @param {Object} state Optional. If not given, the default one is
 *  generated automatically.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  return handleActions({
    [actions.newsletterArchive.fetchDataInit]: onInit,
    [actions.newsletterArchive.fetchDataDone]: onDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();
