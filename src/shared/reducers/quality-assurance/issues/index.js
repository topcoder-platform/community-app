import { combineReducers } from 'redux';
import actions from 'actions/quality-assurance/issues';
import { handleActions } from 'redux-actions';
import { toFSA, resolveReducers } from 'utils/redux';

/**
 * Handles qualityAssuranceIssues.getIssuesDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onDone(state, action) {
  return {
    ...state,
    issues: action.error ? [] : action.payload,
    failed: action.error,
    loading: false,
    dateTime: Date.now(),
  };
}

/**
 * Creates a new getIssues reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return getIssues reducer.
 */
function create(initialState) {
  return handleActions({
    [actions.qualityAssuranceIssues.getIssuesInit](state) {
      return {
        ...state,
        issues: [],
        failed: false,
        loading: true,
        dateTime: Date.now(),
      };
    },
    [actions.qualityAssuranceIssues.getIssuesDone]: onDone,
  }, initialState || {});
}

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for efficient server-side rendering).
 * If HTTP request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function issuesFactory(req) {
  if (req && req.url.endsWith('/quality-assurance/issues/server')) {
    return toFSA(actions.qualityAssuranceIssues.getIssuesDone())
      .then(res => create(onDone({}, res)));
  }
  return Promise.resolve(create());
}

export function factory(req) {
  return resolveReducers({
    data: issuesFactory(req),
  }).then(reducers => combineReducers({
    ...reducers,
  }));
}

export default undefined;
