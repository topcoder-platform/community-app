/**
 * This module provides a service for searching for Topcoder
 * members via API V3.
 */

import { getApiResponsePayloadV3 } from 'utils/tc';
import { getApiV3 } from './api';

class MembersService {
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
   * Gets member's financial information.
   * @param {String} handle User handle.
   * @return {Promise} Resolves to the financial information object.
   */
  async getMemberFinances(handle) {
    const res = await this.private.api.get(`/members/${handle}/financial`);
    return getApiResponsePayloadV3(res);
  }

  /**
   * Gets public information on a member.
   *
   * This method does not require any authorization.
   *
   * @param {String} handle Member handle.
   * @return {Promise} Resolves to the data object.
   */
  async getMemberInfo(handle) {
    const res = await this.private.api.get(`/members/${handle}`);
    return getApiResponsePayloadV3(res);
  }

  /**
   * Gets member statistics.
   * @param {String} handle
   * @return {Promise} Resolves to the stats object.
   */
  async getStats(handle) {
    const res = await this.private.api.get(`/members/${handle}/stats`);
    return getApiResponsePayloadV3(res);
  }

  /**
   * Gets a list of suggested member names for the supplied partial
   * @param {String} keyword Partial string to find suggestions for
   * @return {Promise} Resolves to the api response content
   */
  async getMemberSuggestions(keyword) {
    const res = await this.private.api.get(`/members/_suggest/${keyword}`);
    return getApiResponsePayloadV3(res);
  }
}

/**
 * Returns a new or existing members service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {MembersService} Members service object
 */
let lastInstance = null;
export function getService(tokenV3) {
  if (!lastInstance || tokenV3 !== lastInstance.private.tokenV3) {
    lastInstance = new MembersService(tokenV3);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
