/**
 * The User service provides functionality related to Topcoder user accounts.
 */

import { getApiV3 } from './api';

export default class User {
  /**
   * Creates a new User service.
   * @param {String} tokenV3 Topcoder auth tokenV3.
   */
  constructor(tokenV3) {
    this.private = {
      api: getApiV3(tokenV3),
      tokenV3,
    };
  }

  /**
   * Gets user data object for the specified username.
   *
   * NOTE: Only admins are authorized to use the underlying endpoint.
   *
   * @param {String} username
   * @return {Promise} Resolves to the user data object.
   */
  async getUser(username) {
    let res = await this.private.api.get(`/users?filter=handle%3D${username}`);
    if (!res.ok) throw new Error(res.statusText);
    res = (await res.json()).result;
    if (res.status !== 200) throw new Error(res.content);
    return res.content[0];
  }
}

/**
 * Returns a new or existing User service for the specified tokenV3.
 * @param {String} tokenV3 Optional. Topcoder auth token v3.
 * @return {Api} API v3 service object.
 */
let lastInstance = null;
export function getService(tokenV3) {
  if (!lastInstance || lastInstance.private.tokenV3 !== tokenV3) {
    lastInstance = new User(tokenV3);
  }
  return lastInstance;
}

