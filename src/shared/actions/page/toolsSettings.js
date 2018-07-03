/**
 * Actions for settings page UI.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

export const TOOLSTABS = {
  DEVICES: 'devices',
  SOFTWARE: 'software',
  SERVICEPROVIDERS: 'serviceproviders',
  SUBSCRIPTIONS: 'subscriptions'
};

export default createActions({
  PAGE: {
    SETTINGS: {
      SUB_TAB: _.identity,
      CLEAR_INCORRECT_PASSWORD: _.identity,
    },
  },
});
