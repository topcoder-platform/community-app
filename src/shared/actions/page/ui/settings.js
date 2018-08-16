/**
 * Actions for settings page UI.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';


export default createActions({
  SETTINGS: {
    PROFILE: {
      TOGGLE_TAB: _.identity,
    },
    TOOLS: {
      TOGGLE_TAB: _.identity,
    },
    ACCOUNT: {
      TOGGLE_TAB: _.identity,
    },
  },
});
