/**
 * Actions for settings page UI.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

export const TABS = {
  PROFILE: 'profile',
  ACCOUNT: 'account',
  EMAIL: 'email',
  PREFERENCES: 'preferences',
};

export default createActions({
  PAGE: {
    SETTINGS: {
      SELECT_TAB: _.identity,
      CLEAR_INCORRECT_PASSWORD: _.identity,
    },
  },
});
