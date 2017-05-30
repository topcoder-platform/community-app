/**
 * Reducer for state.example.dataFetch
 */

import actions from 'actions/examples/data-fetch';
import { handleActions } from 'redux-actions';
import { toFSA } from 'utils/redux';

/**
 * Handles examples.dataFetch.fetchDataDone action.
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
 * Creates a new dataFetch reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return dataFetch reducer.
 */
function create(initialState) {
  return handleActions({
    [actions.examples.dataFetch.fetchDataInit](state) {
      return {
        ...state,
        data: null,
        failed: false,
        loading: true,
      };
    },
    [actions.examples.dataFetch.fetchDataDone]: onDone,
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
  if (req && req.url.endsWith('/examples/data-fetch/server')) {
    return toFSA(actions.examples.dataFetch.fetchDataDone())
      .then(res => create(onDone({}, res)));
  }
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
