/**
 * Reducer for state.challengesBlock
 */

import actions from 'actions/contentful';
import { handleActions } from 'redux-actions';

/**
 * Handles contentful.getThriveArticlesInit action.
 * @param {Object} state Previous state.
 */
function onGetThriveArticlesInit(state) {
  return {
    ...state,
    loading: true,
    articles: [],
  };
}

/**
 * Handles contentful.getThriveArticlesDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onGetThriveArticlesDone(state, action) {
  return {
    ...state,
    loading: false,
    articles: action.payload,
  };
}

/**
 * Creates thrive reducer with the specified initial state.
 * @param {Object} state Optional. If not given, the default one is
 *  generated automatically.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  return handleActions({
    [actions.contentful.getThriveArticlesInit]: onGetThriveArticlesInit,
    [actions.contentful.getThriveArticlesDone]: onGetThriveArticlesDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();
