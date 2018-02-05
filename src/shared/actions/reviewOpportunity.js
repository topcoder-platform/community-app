/**
 * Review Opportunity details api actions.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

import { getReviewOpportunitiesService } from 'services/reviewOpportunities';
import { fireErrorMessage } from 'utils/errors';

/**
 * Action to cancel existing applications
 * @param {Number} challengeId The ID of the challenge (not the opportunity id)
 * @param {Array} roleIds Array of roleId Numbers to cancel applications for
 * @param {String} tokenV3 Required. Topcoder auth token v3.
 * @return {Object} Action object
 */
function cancelApplicationsDone(challengeId, roleIds, tokenV3) {
  return getReviewOpportunitiesService(tokenV3)
    .cancelApplications(challengeId, roleIds);
}

/**
 * Action to get the details of a review opportunity for a corresponding challenge
 * @param {Number} challengeId The ID of the challenge (not the opportunity id)
 * @param {String} tokenV3 Optional. Topcoder auth token v3.
 * @return {Object} Action object
 */
function getDetailsDone(challengeId, tokenV3) {
  return getReviewOpportunitiesService(tokenV3)
    .getDetails(challengeId)
    .catch((error) => {
      if (error.status !== 401) {
        fireErrorMessage('Error Getting Review Opportunity Details', error.content || error);
      }
      return Promise.reject(error.status);
    });
}

/**
 * Action to submit applications for review opportunities
 * @param {Number} challengeId The ID of the challenge (not the opportunity id)
 * @param {Array} roleIds Array of roleId Numbers to cancel applications for
 * @param {String} tokenV3 Required. Topcoder auth token v3.
 * @return {Object} Action object
 */
function submitApplicationsDone(challengeId, roleIds, tokenV3) {
  return getReviewOpportunitiesService(tokenV3)
    .submitApplications(challengeId, roleIds);
}

export default createActions({
  REVIEW_OPPORTUNITY: {
    CANCEL_APPLICATIONS_INIT: _.noop,
    CANCEL_APPLICATIONS_DONE: cancelApplicationsDone,
    GET_DETAILS_INIT: _.noop,
    GET_DETAILS_DONE: getDetailsDone,
    SUBMIT_APPLICATIONS_INIT: _.noop,
    SUBMIT_APPLICATIONS_DONE: submitApplicationsDone,
  },
});
