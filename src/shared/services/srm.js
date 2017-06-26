/**
 * Service for communication with srm part of Topcoder API.
 */
import qs from 'qs';

import { getApiV3 } from './api';

class SRMService {

  /**
   * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
   */
  constructor(tokenV3) {
    this.private = {
      api: getApiV3(tokenV3),
      tokenV3,
    };
  }

  getSRMs(params) {
    return this.private.api.get(`/srms/?${qs.stringify(params)}`)
    .then(res => (res.ok ? res.json() : new Error(res.statusText)))
    .then(res => (
      res.result.status === 200
      ? res.result.content
      : new Error(res.result.content)
    ));
  }

  getUserSRMs(userHandle, params) {
    return this.private.api.get(`/members/${userHandle}/srms/?${qs.stringify(params)}`)
    .then(res => (res.ok ? res.json() : new Error(res.statusText)))
    .then(res => (
      res.result.status === 200
      ? res.result.content
      : new Error(res.result.content)
    ));
  }
}

/**
 * Returns a new or existing instance of srm service, which works with
 * the specified auth token.
 * @param {String} tokenV3 Optional. Topcoder API v3 auth token.
 * @return {SRMService} Instance of the service.
 */
let lastInstance = null;
export function getService(tokenV3) {
  if (!lastInstance || tokenV3 !== lastInstance.private.tokenV3) {
    lastInstance = new SRMService(tokenV3);
  }
  return lastInstance;
}

export default undefined;
