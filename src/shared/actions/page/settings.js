/**
 * Actions for settings page UI.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

export const TABS = {
  PROFILE: 'profile',
  SKILLS: 'skills',
  TRACKS: 'tracks',
  TOOLS: 'tools',
  ACCOUNT: 'account',
  PREFERENCES: 'preferences',
};

export default createActions({
  PAGE: {
    SETTINGS: {
      SELECT_TAB: _.identity,
      CLEAR_INCORRECT_PASSWORD: _.identity,
      CLEAR_TOASTR_NOTIFICATION: _.identity,
    },
  },
});
