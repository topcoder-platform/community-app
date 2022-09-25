import React, { useEffect } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

import actions from 'actions/timelineWall';

import TimelineWall from 'components/TimelineWall';
import { isTokenExpired } from '@topcoder-platform/tc-auth-lib';
import { checkIsAdmin } from 'utils/timeline';
import _ from 'lodash';

const TimelineWallContainer = ({
  pendingApprovals, getPendingApprovals, events, getEvents, auth,
}) => {
  const userLoggedIn = !_.isEmpty(auth)
  && !_.isEmpty(auth.tokenV3) && !isTokenExpired(auth.tokenV3);

  const isAdmin = userLoggedIn && checkIsAdmin(auth);

  useEffect(() => {
    if (getEvents && !events.length) {
      getEvents();
    }
  }, []);

  useEffect(() => {
    if (isAdmin && getPendingApprovals && !pendingApprovals.length) {
      getPendingApprovals();
    }
  }, []);

  return (
    <TimelineWall
      events={events}
      pendingApprovals={pendingApprovals}
      userLoggedIn={userLoggedIn}
      isAdmin={isAdmin}
    />
  );
};

TimelineWallContainer.defaultProps = {
  events: [],
  pendingApprovals: [],
  auth: {},
};

TimelineWallContainer.propTypes = {
  getEvents: PT.func.isRequired,
  getPendingApprovals: PT.func.isRequired,
  events: PT.arrayOf(PT.shape()),
  pendingApprovals: PT.arrayOf(PT.shape()),
  auth: PT.shape(),
};

function mapStateToProps(state) {
  return {
    events: state.timelineWall.events,
    pendingApprovals: state.timelineWall.pendingApprovals,
    auth: {
      ...state.auth,
    },
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.timeline;
  return {
    getEvents: () => {
      dispatch(a.fetchTimelineEventsInit());
      dispatch(a.fetchTimelineEventsDone());
    },
    getPendingApprovals: () => {
      dispatch(a.fetchPendingApprovalsInit());
      dispatch(a.fetchPendingApprovalsDone());
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TimelineWallContainer);
