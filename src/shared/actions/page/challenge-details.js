/**
 * Actions related to the UI state of challenge details page.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

/**
 * String values of valid tab names.
 */
export const TABS = {
  DETAILS: 'details',
  REGISTRANTS: 'registrants',
  CHECKPOINTS: 'checkpoints',
  SUBMISSIONS: 'submissions',
  MY_SUBMISSIONS: 'my_submissions',
  WINNERS: 'winners',
  CHALLENGE_FORUM: 'challenge_forum',
};

/* Holds valid values for the specs tab state. */
export const SPECS_TAB_STATES = {
  EDIT: 'EDIT',
  VIEW: 'VIEW',
  SAVING: 'SAVING',
};

/**
 * Creates action that switches the page to the specified content tab.
 * @param {String} tab One of `TAB` values.
 * @return {Action}
 */
function selectTab(tab) {
  return tab;
}

/**
 * Creates action that toggle the submission history.
 * @param {Number} index of subbmission history.
 * @return {Action}
 */
function toggleSubmissionHistory(index) {
  return index;
}

/**
 * Sets the state of specs tab.
 * @param {String} state One of SPECS_TAB_STATES keys.
 * @return {String}
 */
function setSpecsTabState(state) {
  return state;
}

/**
 * Toggles checkpoint feedback. If second argument is provided, it
 * will just open / close the checkpoint depending on its value being
 * true or false.
 * @param {Number} id
 * @param {Boolean} open
 * @return {Object}
 */
function toggleCheckpointFeedback(id, open) {
  return { id, open };
}

/**
 * Creates action that toggle the submission testcase..
 * @param {Number} index of submission testcase.
 * @return {Action}
 */
function toggleSubmissionTestCase(index) {
  return index;
}

export default createActions({
  PAGE: {
    CHALLENGE_DETAILS: {
      SELECT_TAB: selectTab,
      SET_SPECS_TAB_STATE: setSpecsTabState,
      TOGGLE_CHECKPOINT_FEEDBACK: toggleCheckpointFeedback,
      SUBMISSIONS: {
        TOGGLE_SUBMISSION_HISTORY: toggleSubmissionHistory,
        TOGGLE_SUBMISSION_TESTCASE: toggleSubmissionTestCase,
        CLEAR_SUBMISSION_TESTCASE_OPEN: _.identity,
      },
    },
  },
});
