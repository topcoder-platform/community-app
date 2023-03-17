
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

class MfaService {
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
   * Gets user 2fa settings.
   * @param {Number} userId user id
   * @return {Promise} Resolves to the user 2fa settings.
   */
  async getUser2fa(userId) {
    const res = await this.private.api.get(`/users/${userId}/2fa`);
    return handleResponse(res);
  }

  /**
   * Update user 2fa settings
   * @param {Number} userId User id.
   * @param {Boolean} mfaEnabled 2fa data.
   * @return {Promise} Resolves to the user 2fa settings.
   */
  async updateUser2fa(userId, mfaEnabled) {
    const settings = {
      mfaEnabled,
    };

    const res = await this.private.api.patchJson(`/users/${userId}/2fa`, { param: settings });
    return handleResponse(res);
  }

  /**
   * Update user dice settings
   * @param {Number} userId User id.
   * @param {Boolean} diceEnabled dice flag.
   * @return {Promise} Resolves to the user 2fa settings.
   */
  async updateUserDice(userId, diceEnabled) {
    const settings = {
      diceEnabled,
    };

    const res = await this.private.api.patchJson(`/users/${userId}/2fa`, { param: settings });
    return handleResponse(res);
  }

  /**
   * Gets new dice connection.
   * @param {Number} userId user id
   * @return {Promise} Resolves to the dice connection.
   */
  async getNewDiceConnection(userId) {
    const res = await this.private.api.get(`/users/${userId}/diceConnection`);
    return handleResponse(res);
  }

  /**
   * Gets dice connection.
   * @param {Number} userId user id
   * @param {Number} connectionId user id
   * @return {Promise} Resolves to the dice connection.
   */
  async getDiceConnection(userId, connectionId) {
    const res = await this.private.api.get(`/users/${userId}/diceConnection/${connectionId}`);
    return handleResponse(res);
  }
}

let lastInstance = null;
/**
 * Returns a new or existing lookup service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @return {MfaService} Mfa service object
 */
export function getService(tokenV3) {
  if (!lastInstance || tokenV3 !== lastInstance.private.tokenV3) {
    lastInstance = new MfaService(tokenV3);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
