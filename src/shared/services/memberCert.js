/**
 * This module provides a service for convenient manipulation with Topcoder
 * membership via TC API.
 */

import { services } from 'topcoder-react-lib';

const { getApi } = services.api;

class MemberCertService {
  /**
   * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
   */
  constructor(tokenV3) {
    this.private = {
      api: getApi('V3', tokenV3),
      tokenV3,
    };
  }

  /**
   * check user has registered a program or not
   * @param  {string} userId    user's id
   * @param  {string} programId program's id
   * @return {Promise}           a promise will resolve user's program info
   */
  getMemberRegistration(userId, programId) {
    return this.private.api.get(`/memberCert/registrations/${userId}/programs/${programId}/`)
      .then(res => (res.ok ? res.json() : new Error(res.statusText)))
      .then(res => (
        res.result.status === 200 ? res.result.content : new Error(res.result.content)
      ));
  }

  /**
   * register a user to a program
   * @param  {string} userId    user's id
   * @param  {string} programId program's id
   * @return {Promise}          a promise will resolve the request result
   */
  registerMember(userId, programId) {
    return this.private.api.post(`/memberCert/registrations/${userId}/programs/${programId}/`)
      .then(res => (res.ok ? res.json() : new Error(res.statusText)))
      .then(res => (
        res.result.status === 200 ? res.result.content : new Error(res.result.content)
      ));
  }
}

/**
 * Returns a new or existing challenges service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {Challenges} Challenges service object
 */
let lastInstance = null;
export function getService(tokenV3) {
  if (!lastInstance || tokenV3 !== lastInstance.private.tokenV3) {
    lastInstance = new MemberCertService(tokenV3);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
