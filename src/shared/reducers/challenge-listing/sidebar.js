/**
 * Challenge listing sidebar reducer.
 */

import _ from 'lodash';
import actions from 'actions/challenge-listing/sidebar';
import { BUCKETS } from 'utils/challenge-listing/buckets';
import { handleActions } from 'redux-actions';

function create(initialState = {}) {
  const a = actions.challengeListing.sidebar;
  return handleActions({
    [a.getFilters]: (state, action) => ({
      ...state,
      savedFilters: action.error ? [] : action.payload,
    }),
    [a.selectBucket]: (state, { payload }) => ({
      ...state, activeBucket: payload }),
  }, _.defaults(initialState, {
    activeBucket: BUCKETS.ALL,
    savedFilters: [],
  }));
}

export function factory() {
  return Promise.resolve(create());
}

export default create();
