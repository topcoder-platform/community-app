/**
 * This module provides a service for convenient manipulation with Topcoder
 * dashboard resources via TC API.
 */

import _ from 'lodash';

import { getApiV3 } from './api';

class DashboardService {
  /**
   * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
   */
  constructor(tokenV3) {
    this.private = {
      api: getApiV3(tokenV3),
      tokenV3,
    };
  }
}

/**
 * Returns a new or existing challenges service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {Challenges} Challenges service object
 */
let lastInstance = null;
export function getService(tokenV3) {
  if (!lastInstance || (tokenV3 && lastInstance.private.tokenV3 !== tokenV3)) {
    lastInstance = new DashboardService(tokenV3);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
