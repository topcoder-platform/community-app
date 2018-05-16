/**
 * This module provides a service to get lookup data from Topcoder
 * via API V3.
 */
import qs from 'qs';
import { getApiResponsePayloadV3 } from 'utils/tc';
import { getApiV3 } from './api';

class LookupService {
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
   * Gets tags.
   * @param {Object} params Parameters
   * @return {Promise} Resolves to the tags.
   */
  async getTags(params) {
    const res = await this.private.api.get(`/tags/?${qs.stringify(params)}`);
    return getApiResponsePayloadV3(res);
  }
}

/**
 * Returns a new or existing lookup service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {LookupService} Lookup service object
 */
let lastInstance = null;
export function getService(tokenV3) {
  if (!lastInstance || tokenV3 !== lastInstance.private.tokenV3) {
    lastInstance = new LookupService(tokenV3);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;

