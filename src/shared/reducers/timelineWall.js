/**
 * Reducer for state.timelineWall
*/
import actions from 'actions/timelineWall';
import { handleActions } from 'redux-actions';

/**
 * Handles getEventsInit action.
 * @param {Object} state Previous state.
 */
function onEventsInit(state) {
  return {
    ...state,
    events: [],
  };
}

/**
* Handles getEventsDone action.
* @param {Object} state Previous state.
* @param {Object} action The action.
*/
function onEventsDone(state, { payload }) {
  return {
    ...state,
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
    pendingApprovals: [],
  };
}

/**
* Handles fetchPendingApprovalDone action.
* @param {Object} state Previous state.
* @param {Object} action The action.
*/
function onPendingApprovalDone(state, { payload }) {
  return {
    ...state,
    pendingApprovals: payload,
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
    [actions.timeline.fetchTimelineEventsInit]: onEventsInit,
    [actions.timeline.fetchTimelineEventsDone]: onEventsDone,
    [actions.timeline.fetchPendingApprovalsInit]: onPendingApprovalInit,
    [actions.timeline.fetchPendingApprovalsDone]: onPendingApprovalDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();
