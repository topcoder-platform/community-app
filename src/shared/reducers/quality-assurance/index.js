import { combineReducers } from 'redux';
import actions from 'actions/quality-assurance';
import { handleActions } from 'redux-actions';
import { toFSA, resolveReducers } from 'utils/redux';

/**
 * Handles qualityAssurance.getRepositoriesDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onDone(state, action) {
  return {
    ...state,
    repositories: action.error ? [] : action.payload,
    failed: action.error,
    loading: false,
    dateTime: Date.now(),
  };
}

/**
 * Creates a new getRepositories reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return getRepositories reducer.
 */
function create(initialState) {
  return handleActions({
    [actions.qualityAssurance.getRepositoriesInit](state) {
      return {
        ...state,
        repositories: [],
        failed: false,
        loading: true,
        dateTime: Date.now(),
      };
    },
    [actions.qualityAssurance.getRepositoriesDone]: onDone,
  }, initialState || {});
}

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for efficient server-side rendering).
 * If HTTP request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function repositoriesFactory(req) {
  if (req && req.url.endsWith('/quality-assurance/server')) {
    return toFSA(actions.qualityAssurance.getRepositoriesDone())
      .then(res => create(onDone({}, res)));
  }
  return Promise.resolve(create());
}

export function factory(req) {
  return resolveReducers({
    data: repositoriesFactory(req),
  }).then(reducers => combineReducers({
    ...reducers,
  }));
}

export default undefined;
