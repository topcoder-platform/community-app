/**
 * Reducer controlling UI state of the Cognitive community's Resources page.
 */

import _ from 'lodash';
import actions from 'actions/page/communities/cognitive/resources';
import { handleActions } from 'redux-actions';

/**
 * Handler for TOGGLE_FAQ_ITEM action.
 * @param {Object} state Previous state.
 * @param {Object} action
 * @return {Object} New state.
 */
function onToggleFaqItem(state, { payload: { index, show } }) {
  if (Boolean(state.shownFaqItems[index]) === show) return state;
  const shownFaqItems = _.clone(state.shownFaqItems);
  if (show) shownFaqItems[index] = true;
  else delete shownFaqItems[index];
  return { ...state, shownFaqItems };
}

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.page.communities.cognitive.resources;
  return handleActions({
    [a.toggleFaqItem]: onToggleFaqItem,
  }, _.defaults(state, {
    shownFaqItems: {},
  }));
}

export default create();
