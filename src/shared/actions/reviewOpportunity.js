/**
 * Review Opportunity details api actions.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

import { getReviewOpportunitiesService } from 'services/reviewOpportunities';
import { fireErrorMessage } from 'utils/errors';

/**
 * Action to get the details of a review opportunity for a corresponding challenge
 * @param {Number} challengeId The ID of the challenge (not the opportunity id)
 * @param {String} tokenV3 Optional. Topcoder auth token v3.
 * @return {Object} Action object
 */
function getReviewOpportunityDetailsDone(challengeId, tokenV3) {
  return getReviewOpportunitiesService(tokenV3)
    .getReviewOpportunityDetails(challengeId)
    .catch(error => fireErrorMessage('Error Getting Review Opportunity Details', error));
}

export default createActions({
  REVIEW_OPPORTUNITY: {
    GET_REVIEW_OPPORTUNITY_DETAILS_INIT: _.noop,
    GET_REVIEW_OPPORTUNITY_DETAILS_DONE: getReviewOpportunityDetailsDone,
  },
});
