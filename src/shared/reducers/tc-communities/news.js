/**
 * Reducer for state.tcCommunities.news
 */

import actions from 'actions/tc-communities/news';
import { handleActions } from 'redux-actions';

/**
 * Creates a new reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(initialState) {
  const a = actions.tcCommunities.news;
  return handleActions({
    [a.drop]: state => ({ ...state, data: null }),
    [a.getNewsInit]: state => ({ ...state, loading: true }),
    [a.getNewsDone]: (state, { payload }) => ({
      ...state,
      loading: false,
      data: payload.rss.channel.item,
    }),
  }, initialState || {});
}

/**
 * Reducer factory.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return {Promise} Resolves to the new reducer.
 */
export function factory(/* req */) {
  return Promise.resolve(create());
}

/* Default reducer with default initial state. */
export default create();
