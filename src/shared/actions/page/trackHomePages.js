/**
 * Track Home Page Actions.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

export default createActions({
  PAGE: {
    TRACK_HOME_PAGES: {
      SET_SELECTED_TRACK: _.identity,
    },
  },
});
