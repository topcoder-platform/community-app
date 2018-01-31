/**
 * Reducer for state.example.dataFetch
 */

//import actions from 'actions/examples/data-fetch';
import actions from 'actions/quality-assurance';
import { handleActions } from 'redux-actions';
import { toFSA } from 'utils/redux';

/**
 * Handles qualityAssurance.getRepositoriesDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onDone(state, action) {
  console.log("#################################################");
  console.log(state);
  console.log("#################################################");
  console.log(action);
  console.log("#################################################");
  return {
    ...state,
    repositories: action.error ? null : action.payload,
    failed: action.error,
    loading: false,
    dateTime: Date.now()
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
        repositories: null,
        failed: false,
        loading: true,
        dateTime: Date.now()
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
export function factory(req) {

  if (req) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(req.url);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  }

  /* if (req && req.url.endsWith('/examples/data-fetch/server')) {
    return toFSA(actions.examples.dataFetch.fetchDataDone())
      .then(res => create(onDone({}, res)));
  } */
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();