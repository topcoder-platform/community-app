/**
 * This module provides a service for searching for Topcoder
 * members via API V3.
 */

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
   * Gets public information on a member.
   *
   * This method does not require any authorization.
   *
   * @param {String} handle Member handle.
   * @return {Promise} Resolves to the data object.
   */
  async getMemberInfo(handle) {
    let res = await this.private.api.get(`/members/${handle}`);
    if (!res.ok) throw new Error(res.statusText);
    res = (await res.json()).result;
    if (res.status !== 200) throw new Error(res.content);
    return res.content;
  }

  /**
   * Gets a list of suggested member names for the supplied partial
   * @param {String} keyword Partial string to find suggestions for
   * @return {Promise} Resolves to the api response content
   */
  getMemberSuggestions(keyword) {
    return this.private.api.get(`/members/_suggest/${keyword}`)
      .then(res => res.json())
      .then((json) => {
        if (json.result.status === 200) return Promise.resolve(json.result.content);
        return Promise.reject(json.result.content);
      });
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
