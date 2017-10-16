/**
 * Reducer for handling the results of Direct-related actions.
 */

import _ from 'lodash';
import actions from 'actions/direct';
import logger from 'utils/logger';
import { handleActions } from 'redux-actions';
import { decodeToken } from 'tc-accounts';

const ERROR_MSG_GET_USER_PROJECTS_WITHOUT_AUTH_TOKEN
  = 'Cannot get user projects without auth token';

/**
 * Drops out from the state all loaded projects; and cancels the ongoing project
 * loading, if any.
 * @param {Object} state
 * @return {Object} New state.
 */
function onDropAll(state) {
  return {
    ...state,
    loadingProjectsForUsername: '',
    projects: [],
  };
}

/**
 * Handles initialization of projects loading.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetUserProjectsInit(state, { payload: tokenV3 }) {
  if (!tokenV3) {
    logger.error(ERROR_MSG_GET_USER_PROJECTS_WITHOUT_AUTH_TOKEN);
    throw new Error(ERROR_MSG_GET_USER_PROJECTS_WITHOUT_AUTH_TOKEN);
  }
  return {
    ...state,
    loadingProjectsForUsername: decodeToken(tokenV3).handle,
  };
}

/**
 * Handles the result of projects loading.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetUserProjectsDone(state, { error, payload }) {
  if (error) {
    logger.error(payload);
    throw payload;
  }
  const { projects, tokenV3 } = payload;
  if (!tokenV3) {
    logger.error(ERROR_MSG_GET_USER_PROJECTS_WITHOUT_AUTH_TOKEN);
    throw new Error(ERROR_MSG_GET_USER_PROJECTS_WITHOUT_AUTH_TOKEN);
  }
  if (decodeToken(tokenV3).handle !== state.loadingProjectsForUsername) {
    return state;
  }
  return {
    ...state,
    loadingProjectsForUsername: '',
    projects: projects.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

/**
 * Creates a new Topcoder Direct reducer with the specified initial state.
 * @param {Object} state Optional.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.direct;
  return handleActions({
    [a.dropAll]: onDropAll,
    [a.getUserProjectsInit]: onGetUserProjectsInit,
    [a.getUserProjectsDone]: onGetUserProjectsDone,
  }, _.defaults(state, {
    /* Holds username of the user which projects are being loaded; empty
     * string if nothing is being loaded at the moment. */
    loadingProjectsForUsername: '',

    /* Holds the array of loaded projects. */
    projects: [],
  }));
}

/* Exports the default reducer. */
export default create();
