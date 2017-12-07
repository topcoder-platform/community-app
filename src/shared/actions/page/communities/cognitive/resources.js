/**
 * Actions powering the UI state of Cognitive community's Resources page.
 */

import { createActions } from 'redux-actions';

/**
 * Payload creator for the action that toggles (shows/hides) the specified FAQ
 * item.
 * @param {Number} index 0-based index of FAQ item in the page.
 * @param {Boolean} show Whether the item should be shown or hidden.
 * @return {Object} payload.
 */
function toggleFaqItem(index, show) {
  return { index, show };
}

export default createActions({
  PAGE: {
    COMMUNITIES: {
      COGNITIVE: {
        RESOURCES: {
          TOGGLE_FAQ_ITEM: toggleFaqItem,
        },
      },
    },
  },
});
