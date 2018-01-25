/**
 * Actions related to the UI state of review opportunity details page.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

/* Holds valid values for the tab state. */
export const TABS = {
  APPLICATIONS: 'APPLICATIONS',
  CHALLENGE_SPEC: 'CHALLENGE_SPEC',
};

export default createActions({
  PAGE: {
    REVIEW_OPPORTUNITY_DETAILS: {
      SELECT_TAB: _.identity,
      SET_ROLES: _.identity,
      TOGGLE_APPLY_MODAL: _.identity,
      TOGGLE_PHASES_EXPAND: _.noop,
      TOGGLE_ROLE: _.identity,
    },
  },
});
