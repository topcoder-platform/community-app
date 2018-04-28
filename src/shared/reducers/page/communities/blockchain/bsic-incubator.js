/**
 * Reducer controlling UI state of the Blockchain community's BSIC Incubator page.
 */

import _ from 'lodash';
import actions from 'actions/page/communities/blockchain/bsic-incubator';
import { handleActions } from 'redux-actions';

/**
 * Handler for the CLOSE_ALL_FAQ_ITEMS action.
 * @param {Object} state
 * @return {Object} New state.
 */
function onCloseAllFaqItems(state) {
  return { ...state, shownFaqItems: {} };
}

/**
 * Handler for the TOGGLE_FAQ_ITEM action.
 * @param {Object} state Previous state.
 * @param {Object} action
 * @return {Object} New state.
 */
function onToggleFaqItem(state, { payload: { closeOthers, index, show } }) {
  if (Boolean(state.shownFaqItems[index]) === show) return state;
  let shownFaqItems;
  if (closeOthers) shownFaqItems = show ? { [index]: true } : {};
  else {
    shownFaqItems = _.clone(state.shownFaqItems);
    if (show) shownFaqItems[index] = true;
    else delete shownFaqItems[index];
  }
  return { ...state, shownFaqItems };
}

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.page.communities.blockchain.bsicIncubator;
  return handleActions({
    [a.closeAllFaqItems]: onCloseAllFaqItems,
    [a.toggleFaqItem]: onToggleFaqItem,
  }, _.defaults(state, {
    shownFaqItems: {},
  }));
}

export default create();
