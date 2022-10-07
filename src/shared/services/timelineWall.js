/* eslint-disable import/prefer-default-export */
import fetch from 'isomorphic-fetch';
import { config } from 'topcoder-react-utils';
import { logger } from 'topcoder-react-lib';
import _ from 'lodash';
import { DEFAULT_AVATAR_URL } from '../utils/url';

const baseUrl = config.URL.TIMELNE_EVENT_API;
const v5ApiUrl = config.API.V5;

/**
 * Get timeline wall events
 */
export const getTimelineEvents = async () => {
  try {
    const res = await fetch(`${baseUrl}/timelineEvents`);
    return res.json();
  } catch (error) {
    return [];
  }
};

/**
 * Get pending approvals for timeline
 * @param {String} tokenV3
 *
 * @returns {Promise}
 */
export const getPendingApprovals = async (tokenV3) => {
  try {
    const res = await fetch(`${baseUrl}/timelineEvents/review`, {
      headers: { Authorization: `Bearer ${tokenV3}` },
    });
    return res.json();
  } catch (error) {
    logger.error(error);

    return [];
  }
};

/**
 * Get pending approvals for timeline
 * @param {String} tokenV3
 *
 * @returns {Promise}
 */
export const getUserDetails = async (tokenV3) => {
  try {
    const res = await fetch(`${baseUrl}/auth/currentUser`, {
      headers: { Authorization: `Bearer ${tokenV3}` },
    });
    return res.json();
  } catch (e) {
    const error = new Error('Failed to get current user');
    logger.error(error);
    return { isAdmin: false };
  }
};

/**
 * Creates new event.
 *
 * @param {String} tokenV3
 * @param {FormData} body
*
 * @returns {Promise}
 */
export const createEvent = async (tokenV3, body) => {
  try {
    const res = await fetch(`${baseUrl}/timelineEvents`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenV3}` },
      body,
    });

    return res.json();
  } catch (error) {
    return [];
  }
};

/**
 * Get member's photo url
 * @param {String} memberHandle
 *
 * @returns {Promise}
 */
export const getUserAvatar = async (memberHandle) => {
  const res = await fetch(`${v5ApiUrl}/members/${memberHandle}`);
  const member = await res.json();
  const url = _.get(member, 'photoURL');
  return {
    handle: memberHandle,
    photoURL: url || DEFAULT_AVATAR_URL,
  };
};

/**
 * Delete event by id
 *
 * @param {String} tokenV3
 * @param {String} id
 * @param {Function} successFn success callback function.
 *
 * @returns {Promise}
 */
export const deleteEventById = async (tokenV3, id, successFn) => {
  try {
    fetch(`${baseUrl}/timelineEvents/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenV3}` },
    }).then(() => {
      successFn();
      return { success: true };
    }).catch((result) => {
      if (result && result.message) {
        logger.error(result.message);
      }
    });
  } catch (e) {
    const error = new Error('There was an error during deletion.');
    logger.error(error);
  }

  return null;
};

/**
 * Approve event by id
 *
 * @param {String} tokenV3
 * @param {String} id
 * @param {Function} successFn success callback function.
 *
 * @returns {Promise}
 */
export const approveEventById = async (tokenV3, id, successFn) => {
  try {
    fetch(`${baseUrl}/timelineEvents/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenV3}` },
    }).then(() => {
      successFn();
      return { success: true };
    }).catch((result) => {
      if (result && result.message) {
        logger.error(result.message);
      }
    });
  } catch (e) {
    const error = new Error('There was an error during approve.');
    logger.error(error);
  }

  return null;
};

/**
 * Reject event by id
 *
 * @param {String} tokenV3
 * @param {String} id
 * @param {Object} body
 * @param {Function} successFn success callback function.
 *
 * @returns {Promise}
 */
export const rejectEventById = async (tokenV3, id, body, successFn) => {
  try {
    fetch(`${baseUrl}/timelineEvents/${id}/reject`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenV3}` },
      body: JSON.stringify(body),
    }).then(() => {
      successFn();
      return { success: true };
    }).catch((result) => {
      if (result && result.message) {
        logger.error(result.message);
      }
    });
  } catch (e) {
    const error = new Error('There was an error during reject.');
    logger.error(error);
  }

  return null;
};
