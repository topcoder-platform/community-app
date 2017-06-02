/**
 * This module provides a service for convenient manipulation with Topcoder
 * challenges via TC API.
 */

import qs from 'qs';
import { getApiV3 } from './api';

export const ORDER_BY = {
  SUBMISSION_END_DATE: 'submissionEndDate',
};

class ChallengesService {

  /**
   * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
   */
  constructor(tokenV3) {
    /**
     * Private function being re-used in all methods related to getting
     * challenges. It handles query-related arguments in the uniform way:
     * @param {String} endpoint API V3 endpoint, where the request will be send.
     * @param {Object} filters Optional. A map of filters to pass as `filter`
     *  query parameter (this function takes care to stringify it properly).
     * @param {Object} params Optional. A map of any other parameters beside
     *  `filter`.
     */
    const getChallenges = (
      endpoint,
      filters = {},
      params = {},
    ) => {
      const query = {
        filter: qs.stringify(filters),
        ...params,
      };
      return this.private.api.get(`${endpoint}?${qs.stringify(query)}`);
    };

    this.private = {
      api: getApiV3(tokenV3),
      getChallenges,
      tokenV3,
    };
  }

  /**
   * Gets challenges.
   * @param {Object} filters Optional.
   * @param {Object} params Optional.
   * @return {Promise} Resolves to the api response.
   */
  getChallenges(filters, params) {
    return this.private.getChallenges('/challenges/', filters, params);
  }

  /**
   * Gets marathon matches.
   * @param {Object} filters Optional.
   * @param {Object} params Optional.
   * @return {Promise} Resolve to the api response.
   */
  getMarathonMatches(filters, params) {
    return this.private.getChallenges('/marathonMatches/', filters, params);
  }

  /**
   * Gets challenges of the specified user.
   * @param {String} username User whose challenges we want to fetch.
   * @param {Object} filters Optional.
   * @param {Number} params Optional.
   * @return {Promise} Resolves to the api response.
   */
  getUserChallenges(username, filters, params) {
    const endpoint = `/members/${username.toLowerCase()}/challenges/`;
    return this.private.getChallenges(endpoint, filters, params);
  }

  /**
   * Gets marathon matches of the specified user.
   * @param {String} username User whose challenges we want to fetch.
   * @param {Object} filters Optional.
   * @param {Number} params Optional.
   * @return {Promise} Resolves to the api response.
   */
  getUserMarathonMatches(username, filters, params) {
    const endpoint = `/members/${username.toLowerCase()}/mms/`;
    return this.private.api.get(endpoint, filters, params);
  }
}

/**
 * Returns a new or existing challenges service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {Challenges} Challenges service object
 */
let lastInstance = null;
export function getService(tokenV3) {
  if (!lastInstance || lastInstance.tokenV3 !== tokenV3) {
    lastInstance = new ChallengesService(tokenV3);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
