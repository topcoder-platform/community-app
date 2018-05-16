/**
 * This module provides a service for searching for Topcoder
 * members via API V3.
 */
/* global XMLHttpRequest */
import _ from 'lodash';
import { logger } from 'utils/logger';
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
   * Gets member external account info.
   * @param {String} handle
   * @return {Promise} Resolves to the stats object.
   */
  async getExternalAccounts(handle) {
    const res = await this.private.api.get(`/members/${handle}/externalAccounts`);
    return getApiResponsePayloadV3(res);
  }

  /**
   * Gets member external links.
   * @param {String} handle
   * @return {Promise} Resolves to the stats object.
   */
  async getExternalLinks(handle) {
    const res = await this.private.api.get(`/members/${handle}/externalLinks`);
    return getApiResponsePayloadV3(res);
  }

  /**
   * Adds external web link for member.
   * @param {String} userHandle The user handle
   * @param {String} webLink The external web link
   * @return {Promise} Resolves to the api response content
   */
  async addWebLink(userHandle, webLink) {
    const res = await this.private.api.postJson(`/members/${userHandle}/externalLinks`, { param: { url: webLink } });
    return getApiResponsePayloadV3(res);
  }

  /**
   * Deletes external web link for member.
   * @param {String} userHandle The user handle
   * @param {String} webLinkHandle The external web link handle
   * @return {Promise} Resolves to the api response content
   */
  async deleteWebLink(userHandle, webLinkHandle) {
    const body = {
      param: {
        handle: webLinkHandle,
      },
    };
    const res = await this.private.api.delete(`/members/${userHandle}/externalLinks/${webLinkHandle}`, JSON.stringify(body));
    return getApiResponsePayloadV3(res);
  }

  /**
   * Gets member skills.
   * @param {String} handle
   * @return {Promise} Resolves to the stats object.
   */
  async getSkills(handle) {
    const res = await this.private.api.get(`/members/${handle}/skills`);
    return getApiResponsePayloadV3(res);
  }

  /**
   * Adds user skill.
   * @param {String} handle Topcoder user handle
   * @param {Number} skillTagId Skill tag id
   * @return {Promise} Resolves to operation result
   */
  async addSkill(handle, skillTagId) {
    const body = {
      param: {
        skills: {
          [skillTagId]: {
            hidden: false,
          },
        },
      },
    };
    const res = await this.private.api.patchJson(`/members/${handle}/skills`, body);
    return getApiResponsePayloadV3(res);
  }

  /**
   * Hides user skill.
   * @param {String} handle Topcoder user handle
   * @param {Number} skillTagId Skill tag id
   * @return {Promise} Resolves to operation result
   */
  async hideSkill(handle, skillTagId) {
    const body = {
      param: {
        skills: {
          [skillTagId]: {
            hidden: true,
          },
        },
      },
    };
    const res = await this.private.api.fetch(`/members/${handle}/skills`, {
      body: JSON.stringify(body),
      method: 'PATCH',
    });
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
   * Gets a list of suggested member names for the supplied partial.
   *
   * WARNING: This method requires v3 authorization.
   *
   * @param {String} keyword Partial string to find suggestions for
   * @return {Promise} Resolves to the api response content
   */
  async getMemberSuggestions(keyword) {
    const res = await this.private.api.get(`/members/_suggest/${keyword}`);
    return getApiResponsePayloadV3(res);
  }

  /**
   * Updates member profile.
   * @param {Object} profile The profile to update.
   * @return {Promise} Resolves to the api response content
   */
  async updateMemberProfile(profile) {
    const res = await this.private.api.putJson(`/members/${profile.handle}`, { param: profile });
    return getApiResponsePayloadV3(res);
  }

  /**
   * Gets presigned url for member photo file.
   * @param {String} userHandle The user handle
   * @param {File} file The file to get its presigned url
   * @return {Promise} Resolves to the api response content
   */
  async getPresignedUrl(userHandle, file) {
    const res = await this.private.api.postJson(`/members/${userHandle}/photoUploadUrl`, { param: { contentType: file.type } });
    const payload = await getApiResponsePayloadV3(res);

    return {
      preSignedURL: payload.preSignedURL,
      token: payload.token,
      file,
      userHandle,
    };
  }

  /**
   * Updates member photo.
   * @param {Object} S3Response The response from uploadFileToS3() function.
   * @return {Promise} Resolves to the api response content
   */
  async updateMemberPhoto(S3Response) {
    const res = await this.private.api.putJson(`/members/${S3Response.userHandle}/photo`, { param: S3Response.body });
    return getApiResponsePayloadV3(res);
  }

  /**
   * Uploads file to S3.
   * @param {Object} presignedUrlResponse The presigned url response from
   *                                      getPresignedUrl() function.
   * @return {Promise} Resolves to the api response content
   */
  uploadFileToS3(presignedUrlResponse) {
    _.noop(this);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', presignedUrlResponse.preSignedURL, true);
      xhr.setRequestHeader('Content-Type', presignedUrlResponse.file.type);

      xhr.onreadystatechange = () => {
        const { status } = xhr;
        if (((status >= 200 && status < 300) || status === 304) && xhr.readyState === 4) {
          resolve({
            userHandle: presignedUrlResponse.userHandle,
            body: {
              token: presignedUrlResponse.token,
              contentType: presignedUrlResponse.file.type,
            },
          });
        } else if (status >= 400) {
          const err = new Error('Could not upload image to S3');
          err.status = status;
          reject(err);
        }
      };

      xhr.onerror = (err) => {
        logger.error('Could not upload image to S3', err);

        reject(err);
      };

      xhr.send(presignedUrlResponse.file);
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
