/**
 * Actions related to the header filter panel.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';

export default createActions({
  CHALLENGE_LISTING: {
    FILTER_PANEL: {
      /* Expands / collapses the filter panel. */
      SET_EXPANDED: _.identity,

      /* Updates text in the search bar, without applying it to the active
       * challenge filter. The text will be set to the filter when Enter is
       * pressed. */
      SET_SEARCH_TEXT: _.identity,

      /* Shows / hides the modal with track switches (for mobile view only). */
      SHOW_TRACK_MODAL: _.identity,
    },
  },
});
