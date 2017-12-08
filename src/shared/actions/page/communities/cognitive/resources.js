/**
 * Actions powering the UI state of Cognitive community's Resources page.
 */

import { createActions } from 'redux-actions';

/**
 * Payload creator for the action that hides (closes) all FAQ items.
 */
function closeAllFaqItems() {
  return null;
}

/**
 * Payload creator for the action that toggles (shows/hides) the specified FAQ
 * item.
 * @param {Number} index 0-based index of FAQ item in the page.
 * @param {Boolean} show Whether the item should be shown or hidden.
 * @param {Boolean} closeOthers Tells, whether other FAQ items should be closed.
 * @return {Object} payload.
 */
function toggleFaqItem(index, show, closeOthers) {
  return { closeOthers, index, show };
}

export default createActions({
  PAGE: {
    COMMUNITIES: {
      COGNITIVE: {
        RESOURCES: {
          CLOSE_ALL_FAQ_ITEMS: closeAllFaqItems,
          TOGGLE_FAQ_ITEM: toggleFaqItem,
        },
      },
    },
  },
});
