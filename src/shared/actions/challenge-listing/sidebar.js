/**
 * Actions for the sidebar.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getUserSettingsService } from 'services/user-settings';

function getSavedFilters(tokenV2) {
  return getUserSettingsService(tokenV2).getFilters();
}

export default createActions({
  CHALLENGE_LISTING: {
    SIDEBAR: {
      GET_SAVED_FILTERS: getSavedFilters,
      SELECT_BUCKET: _.identity,
    },
  },
});
