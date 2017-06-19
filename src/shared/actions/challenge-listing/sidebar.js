/**
 * Actions for the sidebar.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';

export default createActions({
  CHALLENGE_LISTING: {
    SIDEBAR: {
      SELECT_BUCKET: _.identity,
    },
  },
});
