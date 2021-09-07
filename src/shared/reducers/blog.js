/**
 * Reducer for the community leaderboard page
 */

import actions from 'actions/blog';
import { redux } from 'topcoder-react-utils';

/**
 * Handles contentful.getThriveArticlesInit action.
 * @param {Object} state Previous state.
 */
function onGetCommunityStoriesInit(state) {
  return {
    ...state,
    communityStoriesLoading: true,
    communityStories: [],
  };
}

/**
 * Handles contentful.getThriveArticlesDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onGetCommunityStoriesDone(state, action) {
  return {
    ...state,
    communityStoriesLoading: false,
    communityStories: action.payload,
  };
}

/**
 * Creates a new blog reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return Function reducer.
 */
function create(initialState = {}) {
  return redux.handleActions({
    [actions.blog.getCommunityStoriesInit]: onGetCommunityStoriesInit,
    [actions.blog.getCommunityStoriesDone]: onGetCommunityStoriesDone,
  }, initialState);
}

/* Default reducer with empty initial state. */
export default create();
