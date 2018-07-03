/**
 * Actions for settings page UI.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

export const PREFERENCESTABS = {
  EMAIL:'email',
  FORUM:'forum',
  PAYMENT:'payment',
  INVITATIONLETTER:'invitationletter',
  REFERRALS:'referrals',
  PERSONALIZATION:'personalization'
};

export default createActions({
  PAGE: {
    SETTINGS: {
      SUB_TAB: _.identity,
      CLEAR_INCORRECT_PASSWORD: _.identity,
    },
  },
});
