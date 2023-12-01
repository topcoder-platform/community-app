/**
 * Reducer for dashboard
 */

import actions from 'actions/dashboard';
import { redux } from 'topcoder-react-utils';
import qs from 'qs';

function onInit(state, { payload }) {
  return {
    ...state,
    [payload]: {
      details: null,
      failed: false,
      loading: true,
    },
  };
}

/**
 * Handles done actions.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onDone(state, action) {
  return {
    ...state,
    [action.payload.title]: {
      challenges: action.error ? null : action.payload.challenges,
      failed: action.error,
      loading: false,
    },
  };
}

/**
 * Creates a new challenges reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return challenges reducer.
 */
function create(initialState) {
  return redux.handleActions({
    [actions.dashboard.fetchChallengesInit]: onInit,
    [actions.dashboard.fetchChallengesDone]: onDone,
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
  if (req && req.url.endsWith('/home')) {
    return redux.resolveAction(actions.dashboard.fetchChallengesDone())
      .then(res => create(onDone({}, res)));
  }
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
