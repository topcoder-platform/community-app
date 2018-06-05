/**
 * Reducer controlling UI state of the iot community's assets page.
 */

import _ from 'lodash';
import actions from 'actions/page/communities/iot/assets';
import { handleActions } from 'redux-actions';

/**
 * Handler for the TOGGLE_GRID action.
 * @param {Object} state
 * @return {Object} New state.
 */
function onToggleGrid(state) {
  return { ...state, display: 'grid' };
}

/**
 * Handler for the TOGGLE_LIST action.
 * @param {Object} state
 * @return {Object} New state.
 */
function onToggleList(state) {
  return { ...state, display: 'list' };
}

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state as `list`.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.page.communities.iot.assets;
  return handleActions({
    [a.toggleGrid]: onToggleGrid,
    [a.toggleList]: onToggleList,
  }, _.defaults(state, {
    display: 'list',
  }));
}

export default create();
