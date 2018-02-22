/**
 * The User service provides functionality related to Topcoder user accounts.
 */

import { getApiResponsePayloadV3 } from 'utils/tc';
import { getApiV2, getApiV3 } from './api';

export default class User {
  /**
   * Creates a new User service.
   * @param {String} tokenV3 Topcoder auth tokenV3.
   * @param {String} tokenV2 TC auth token v2.
   */
  constructor(tokenV3, tokenV2) {
    this.private = {
      api: getApiV3(tokenV3),
      apiV2: getApiV2(tokenV2),
      tokenV2,
      tokenV3,
    };
  }

  /**
   * Gets user achievements. Does not need auth.
   * @param {String} username
   * @return {Object}
   */
  async getAchievements(username) {
    const res = await this.private.apiV2.get(`/users/${username}`);
    if (!res.ok) throw new Error(res.statusText);
    return (await res.json()).Achievements || [];
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
    const url = `/users?filter=handle%3D${username}`;
    const res = await this.private.api.get(url);
    return (await getApiResponsePayloadV3(res))[0];
  }
}

/**
 * Returns a new or existing User service for the specified tokenV3.
 * @param {String} tokenV3 Optional. Topcoder auth token v3.
 * @param {String} tokenV2 Optional. TC auth token v2.
 * @return {Api} API v3 service object.
 */
let lastInstance = null;
export function getService(tokenV3, tokenV2) {
  if (!lastInstance
  || lastInstance.private.tokenV2 !== tokenV2
  || lastInstance.private.tokenV3 !== tokenV3) {
    lastInstance = new User(tokenV3, tokenV2);
  }
  return lastInstance;
}

