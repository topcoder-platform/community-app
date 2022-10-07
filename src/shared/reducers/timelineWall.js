/**
 * Reducer for state.timelineWall
*/
import actions from 'actions/timelineWall';
import { handleActions } from 'redux-actions';
import { DEFAULT_AVATAR_URL } from '../utils/url';

/**
 * Handles onGetUserDetailsInit action.
 * @param {Object} state Previous state.
 */
function onGetUserDetailsInit(state) {
  return {
    ...state,
    isAdmin: false,
  };
}

/**
 * Handles onGetUserDetailsDone action.
 * @param {Object} state Previous state.
 */
function onGetUserDetailsDone(state, { payload }) {
  return {
    ...state,
    isAdmin: payload.isAdmin,
  };
}

/**
 * Handles getEventsInit action.
 * @param {Object} state Previous state.
 */
function onEventsInit(state) {
  return {
    ...state,
    loading: true,
    events: [],
  };
}

/**
* Handles getEventsDone action.
* @param {Object} state Previous state.
* @param {Object} payload The payload.
*/
function onEventsDone(state, { payload }) {
  return {
    ...state,
    loading: false,
    events: payload,
  };
}

/**
 * Handles fetchPendingApprovalInit action.
 * @param {Object} state Previous state.
 */
function onPendingApprovalInit(state) {
  return {
    ...state,
    loading: true,
    pendingApprovals: [],
  };
}

/**
* Handles fetchPendingApprovalDone action.
* @param {Object} state Previous state.
* @param {Object} payload The payload.
*/
function onPendingApprovalDone(state, { payload }) {
  return {
    ...state,
    loading: false,
    pendingApprovals: payload,
  };
}

/**
* Handles onCreateNewEventDone action.
* @param {Object} state Previous state.
* @param {Object} payload The payload.
*/
function onCreateNewEventDone(state) {
  return {
    ...state,
  };
}

/**
* Handles onFetchUserAvatarInit action.
* @param {Object} state Previous state.
* @param {Object} payload The payload.
*/
function onFetchUserAvatarInit(state, { payload }) {
  const avatars = state.userAvatars || {};
  return {
    ...state,
    userAvatars: {
      ...avatars,
      [payload]: DEFAULT_AVATAR_URL,
    },
  };
}

/**
* Handles onFetchUserAvatarDone action.
* @param {Object} state Previous state.
* @param {Object} payload The payload.
*/
function onFetchUserAvatarDone(state, { payload }) {
  const avatars = state.userAvatars || {};
  return {
    ...state,
    userAvatars: {
      ...avatars,
      [payload.handle]: payload.photoURL,
    },
  };
}

/**
* Creates timeline reducer with the specified initial state.
* @param {Object} state Optional. If not given, the default one is
*  generated automatically.
* @return {Function} Reducer.
*/
function create(state = {}) {
  return handleActions({
    [actions.timeline.getUserDetailsInit]: onGetUserDetailsInit,
    [actions.timeline.getUserDetailsDone]: onGetUserDetailsDone,
    [actions.timeline.fetchTimelineEventsInit]: onEventsInit,
    [actions.timeline.fetchTimelineEventsDone]: onEventsDone,
    [actions.timeline.fetchPendingApprovalsInit]: onPendingApprovalInit,
    [actions.timeline.fetchPendingApprovalsDone]: onPendingApprovalDone,
    // [actions.timeline.createNewEventInit]: onCreateNewEventInit,
    [actions.timeline.createNewEventDone]: onCreateNewEventDone,
    [actions.timeline.fetchUserAvatarInit]: onFetchUserAvatarInit,
    [actions.timeline.fetchUserAvatarDone]: onFetchUserAvatarDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();
