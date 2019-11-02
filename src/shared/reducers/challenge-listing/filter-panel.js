/**
 * Reducer for actions related to the header filter panel.
 */

import _ from 'lodash';
import actions from 'actions/challenge-listing/filter-panel';
import { handleActions } from 'redux-actions';

/**
 * Creates a new reducer.
 * @param {Object} initialState Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(initialState = {}) {
  const a = actions.challengeListing.filterPanel;
  return handleActions({
    [a.setExpanded]: (state, { payload }) => ({ ...state, expanded: payload }),
    [a.setSearchText]: (state, { payload }) => ({ ...state, searchText: payload }),
    [a.showTrackModal]: (state, { payload }) => ({ ...state, trackModalShown: payload }),
  }, _.defaults(initialState, {
    expanded: false,
    searchText: '',
    trackModalShown: false,
  }));
}

export function factory() {
  return Promise.resolve(create());
}

export default create();
