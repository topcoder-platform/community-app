/**
 * Actions related to topcoder timeline wall
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import {
  getTimelineEvents, getPendingApprovals, getUserDetails, createEvent,
  getUserAvatar,
} from '../services/timelineWall';

/**
 * Fetch timeline events
 */
async function getEventsDone() {
  return getTimelineEvents();
}

/**
 * Fetch pending approvals
 *
 * @param {String} tokenV3
 *
 * @returns {Promise}
 */
async function getPendingApprovalsDone(tokenV3) {
  return getPendingApprovals(tokenV3);
}

/**
  * Check if logged in user is in the configured Admin.
  *
  * @param {String} tokenV3
  *
  * @returns {Promise}
 */
async function getUserDetailsDone(tokenV3) {
  return getUserDetails(tokenV3);
}

/**
  * Creates new event for timeline
  *
  * @param {Object} body event body
  * @param {String} tokenV3
  *
  * @returns {Promise}
 */
async function createNewEventDone(tokenV3, body) {
  return createEvent(tokenV3, body);
}

/**
  * Get user avatar url
  *
  * @param {String} handle
  *
  * @returns {Promise}
 */
async function fetchUserAvatarDone(handle) {
  return getUserAvatar(handle);
}

export default createActions({
  TIMELINE: {
    FETCH_USER_AVATAR_INIT: _.noop,
    FETCH_USER_AVATAR_DONE: fetchUserAvatarDone,
    GET_USER_DETAILS_INIT: _.noop,
    GET_USER_DETAILS_DONE: getUserDetailsDone,
    FETCH_TIMELINE_EVENTS_INIT: _.noop,
    FETCH_TIMELINE_EVENTS_DONE: getEventsDone,
    FETCH_PENDING_APPROVALS_INIT: _.noop,
    FETCH_PENDING_APPROVALS_DONE: getPendingApprovalsDone,
    CREATE_NEW_EVENT_INIT: _.noop,
    CREATE_NEW_EVENT_DONE: createNewEventDone,
  },
});
