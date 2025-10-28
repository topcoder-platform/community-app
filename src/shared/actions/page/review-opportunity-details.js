/**
 * Actions related to the UI state of review opportunity details page.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';
import { logger } from 'topcoder-react-lib';

import { getDetails, submitApplications } from '../../services/reviewOpportunities';


/* Holds valid values for the tab state. */
export const TABS = {
  APPLICATIONS: 'APPLICATIONS',
  CHALLENGE_SPEC: 'CHALLENGE_SPEC',
};

/**
 * @static
 * @desc Creates an action that signals beginning of loading the review
 *  opportunity details.
 * @return {Action}
 */
function getDetailsInit() {}

/**
 * @static
 * @desc Creates an action that gets details of a review opportunity for
 *  the specified challenge.
 * @param {Number} challengeId The ID of the challenge (not the opportunity id)
 * @param {Number} opportunityId The ID of the review opportunity
 * @param {String} tokenV3=null Optional. Topcoder auth token v3.
 * @return {Action}
 */
function getDetailsDone(challengeId, opportunityId) {
  return getDetails(challengeId, opportunityId)
    .then(details => ({ details }))
    .catch((error) => {
      if (error.status !== 401) {
        logger.error('Error Getting Review Opportunity Details', error.content || error);
      }
      return Promise.reject(error.status);
    });
}

/**
 * @static
 * @desc Creates an action that signals beginning of review application process.
 * @return {Action}
 */
function submitAppliationInit() {}

/**
 * @static
 * @desc Creates an action that submits application for a review opportunity.
 * @param {Number} challengeId The ID of the challenge (not the opportunity id)
 * @param {Array} roleIds Array of roleId Numbers to cancel applications for
 * @param {String} tokenV3 Required. Topcoder auth token v3.
 * @return {Action}
 */
function submitApplicationsDone(challengeId, tokenV3) {
  return submitApplications(challengeId, tokenV3);
}

export default createActions({
  PAGE: {
    REVIEW_OPPORTUNITY_DETAILS: {
      GET_DETAILS_INIT: getDetailsInit,
      GET_DETAILS_DONE: getDetailsDone,
      SUBMIT_APPLICATIONS_INIT: submitAppliationInit,
      SUBMIT_APPLICATIONS_DONE: submitApplicationsDone,
      SELECT_TAB: _.identity,
      SET_ROLES: _.identity,
      TOGGLE_APPLY_MODAL: _.identity,
      TOGGLE_PHASES_EXPAND: _.noop,
      TOGGLE_ROLE: _.identity,
    },
  },
});
