/**
 * Actions related to the UI state of challenge details page.
 */

import { createActions } from 'redux-actions';

/* Holds valid values for the specs tab state. */
export const SPECS_TAB_STATES = {
  EDIT: 'EDIT',
  VIEW: 'VIEW',
};

/**
 * Sets the state of specs tab.
 * @param {String} state One of SPECS_TAB_STATES keys.
 * @return {String}
 */
function setSpecsTabState(state) {
  return state;
}

export default createActions({
  PAGE: {
    CHALLENGE_DETAILS: {
      SET_SPECS_TAB_STATE: setSpecsTabState,
    },
  },
});
