/**
 * This module provides a service for retrieving Review Opportunities and
 * submitting applications.
 */

import { getApiV3 } from './api';

class ReviewOpportunitiesService {
  /**
   * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
   */
  constructor(tokenV3) {
    this.private = {
      api: getApiV3(tokenV3),
      tokenV3,
    };
  }

  /**
   * Gets a list of currently open Review Opportunities.
   * @param {Number} limit The max number to return in one call.
   * @param {Number} offset Offset, used with limit to lazy load.
   * @return {Promise} Resolves to the api response in JSON.
   */
  getReviewOpportunities(limit, offset) {
    const endpoint = `/reviewOpportunities?limit=${limit}&offset=${offset}`;
    return this.private.api.get(endpoint)
      .then(res => (res.ok ? res.json() : Promise.reject(`Error Code: ${res.status}`)))
      .then(res => (
        res.result.status === 200 ?
          res.result.content :
          Promise.reject(res.result.content)
      ));
  }

  /**
   * Gets the details of the review opportunity for the corresponding challenge
   * @param {Number} challengeId The ID of the challenge (not the opportunity id)
   * @return {Promise} Resolves to the api response in JSON.
   */
  getDetails(challengeId) {
    const endpoint = `/reviewOpportunities/${challengeId}`;
    return this.private.api.get(endpoint)
      .then(res => res.json())
      .then(res => (
        res.result.status === 200 ?
          res.result.content :
          Promise.reject(res.result)
      ));
  }

  /**
   * Submits review opportunity application for the specified challenge
   * @param {Number} challengeId The ID of the challenge (not the opportunity id)
   * @param {Array} roleIds List of review role IDs to apply for
   * @return {Promise} Resolves to the api response in JSON.
   */
  submitApplications(challengeId, roleIds) {
    const endpoint = `/reviewOpportunities/${challengeId}/applications?reviewApplicationRoleIds=${roleIds.join(',')}`;
    return this.private.api.post(endpoint, {})
      .then(res => JSON.parse(res));
  }

  /**
   * Cancels review opportunity application for the specified challenge
   * @param {Number} challengeId The ID of the challenge (not the opportunity id)
   * @param {Array} roleIds List of review role IDs to cancel applications for
   * @return {Promise} Resolves to the api response in JSON.
   */
  cancelApplications(challengeId, roleIds) {
    const endpoint = `/reviewOpportunities/${challengeId}/applications?reviewApplicationRoleIds=${roleIds.join(',')}`;
    return this.private.api.delete(endpoint, {})
      .then(res => JSON.parse(res));
  }
}

/**
 * Returns a new or existing review opportunities service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {MembersService} Members service object
 */
let lastInstance = null;
export function getReviewOpportunitiesService(tokenV3) {
  if (!lastInstance || tokenV3 !== lastInstance.private.tokenV3) {
    lastInstance = new ReviewOpportunitiesService(tokenV3);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
