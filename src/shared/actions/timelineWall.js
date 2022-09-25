import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getTimelineEvents, getPendingApprovals } from '../services/timelineWall';

/**
 * Fetch timeline events
 */
function getEventsDone() {
  return getTimelineEvents();
}

/**
 * Fetch pending approvals
 */
function getPendingApprovalsDone() {
  return getPendingApprovals();
}

export default createActions({
  TIMELINE: {
    FETCH_TIMELINE_EVENTS_INIT: _.noop,
    FETCH_TIMELINE_EVENTS_DONE: getEventsDone,
    FETCH_PENDING_APPROVALS_INIT: _.noop,
    FETCH_PENDING_APPROVALS_DONE: getPendingApprovalsDone,
  },
});
