/**
 * Actions for settings page UI.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

export const ACCOUNTTABS = {
  MYACCOUNT: 'myaccount',
  LINKEDACCOUNT: 'linkedaccount'
};

export default createActions({
  PAGE: {
    SETTINGS: {
      SUB_TAB: _.identity,
      CLEAR_INCORRECT_PASSWORD: _.identity,
    },
  },
});
