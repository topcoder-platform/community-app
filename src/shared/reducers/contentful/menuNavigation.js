/**
 * Reducer for state.menuNavigation
 */

import actions from 'actions/contentful';
import { handleActions } from 'redux-actions';

/**
 * Handles menuNavigation.getMenuInit action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onGetMenuInit(state, action) {
  return {
    ...state,
    [action.payload.id]: {
      loading: true,
      menu: [],
      menuLogo: {},
    },
  };
}

/**
 * Handles menuNavigation.getMenuDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onGetMenuDone(state, action) {
  return {
    ...state,
    [action.payload.id]: {
      loading: false,
      menu: action.payload.menu,
      menuLogo: action.payload.menuLogo || {},
    },
  };
}

/**
 * Creates challengesBlock reducer with the specified initial state.
 * @param {Object} state Optional. If not given, the default one is
 *  generated automatically.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  return handleActions({
    [actions.contentful.getMenuInit]: onGetMenuInit,
    [actions.contentful.getMenuDone]: onGetMenuDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();
