
import { services } from 'topcoder-react-lib';

const { getApi } = services.api;

/**
 * Handles the response from identity service
 * @param {Object} res response
 * @return {Promise} Resolves to the payload.
 */
async function handleResponse(res) {
  const { result } = await res.json();

  if (!res.ok) {
    throw new Error(result ? result.content : '');
  }

  if (!result) {
    return null;
  }

  if ((!result.success)) {
    throw new Error(result.content);
  }
  return result.content;
}

class IdentityService {
  /**
   * @param {String} tokenV3 Auth token for Topcoder API v3.
   */
  constructor(tokenV3) {
    this.private = {
      api: getApi('V3', tokenV3),
      tokenV3,
    };
  }

  /**
   * Update users primary role
   * @param {String} role - role to be updated can be 'Topcoder Talent' or 'Topcoder Customer'
   * @return {Promise}
   */
  async updatePrimaryRole(role) {
    const res = await this.private.api.postJson('/users/updatePrimaryRole', { param: { primaryRole: role } });
    return handleResponse(res);
  }
}

let lastInstance = null;
/**
 * Returns a new or existing lookup service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {IdentityService} Mfa service object
 */
export function getService(tokenV3) {
  if (!lastInstance || tokenV3 !== lastInstance.private.tokenV3) {
    lastInstance = new IdentityService(tokenV3);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
