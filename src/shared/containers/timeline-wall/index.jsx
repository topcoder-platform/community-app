import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import TopBanner from 'assets/images/timeline-wall/top-banner.png';
import TopBannerMobile from 'assets/images/timeline-wall/top-banner-mobile.png';
import IconCheveronDownBlue from 'assets/images/timeline-wall/cheveron-down-blue.svg';
import { deleteEventById, approveEventById, rejectEventById } from 'services/timelineWall';
import cn from 'classnames';
import _ from 'lodash';
import timelineActions from 'actions/timelineWall';
import LoadingIndicator from 'components/LoadingIndicator';
import TimelineEvents from './timeline-events';
import PendingApprovals from './pending-approvals';

import './styles.scss';

function TimelineWallContainer(props) {
  const [tab, setTab] = useState(0);
  const [showRightFilterMobile, setShowRightFilterMobile] = useState(false);
  const [selectedFilterValue, setSelectedFilterValue] = useState({
    year: 0,
    month: -1,
  });

  const {
    isAdmin,
    loadUserDetails,
    auth,
    createNewEvent,
    getTimelineEvents,
    getPendingApprovals,
    loading,
    events,
    getAvatar,
    userAvatars,
    pendingApprovals,
    uploading,
  } = props;

  const role = 'Admin User';
  const authToken = _.get(auth, 'tokenV3');

  useEffect(() => {
    if (authToken) {
      loadUserDetails(authToken);
    }

    getTimelineEvents();
  }, []);

  useEffect(() => {
    if (authToken && isAdmin && !pendingApprovals.length) {
      getPendingApprovals(authToken);
    }
  }, [isAdmin]);

  useEffect(() => {
    if ((events || []).length) {
      _.uniqBy(events, 'createdBy').forEach((eventItem) => {
        const photoURL = _.get(userAvatars, eventItem.createdBy);
        if (!photoURL) {
          getAvatar(eventItem.createdBy);
        }
      });
    }
  }, [events]);

  useEffect(() => {
    if ((pendingApprovals || []).length) {
      _.uniqBy(pendingApprovals, 'createdBy').forEach((eventItem) => {
        const photoURL = _.get(userAvatars, eventItem.createdBy);
        if (!photoURL) {
          getAvatar(eventItem.createdBy);
        }
      });
    }
  }, [pendingApprovals]);

  useEffect(() => {
    const target = document.getElementById(`${selectedFilterValue.year}-${selectedFilterValue.month}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' }, true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedFilterValue]);


  const deleteEvent = (id) => {
    deleteEventById(authToken, id, () => {
      getPendingApprovals(authToken);
    });
  };

  const onApproveEvent = (id) => {
    approveEventById(authToken, id, () => {
      getPendingApprovals(authToken);
    });
  };

  const removeEvent = (id, body) => {
    rejectEventById(authToken, id, body, () => {
      getPendingApprovals(authToken);
    });
  };

  const sortedEvents = _.orderBy(events, ['eventDate'], ['desc']);

  return (
    <div styleName="container">
      <div styleName={isAdmin ? 'header header-admin' : 'header'}>
        <img src={TopBanner} alt="top-banner" styleName="header-bg hide-mobile" />
        <img src={TopBannerMobile} alt="top-banner" styleName="header-bg hide-desktop show-mobile" />

        {isAdmin ? (
          <div styleName="header-content-2">
            <button
              styleName={cn('tab-item',
                {
                  selected: tab === 0,
                })}
              onClick={() => setTab(0)}
              type="button"
            >
              <div styleName="content">Timeline View<div styleName="select-indicator" /></div>
            </button>
            <button
              styleName={cn('tab-item',
                {
                  selected: tab === 1,
                })}
              onClick={() => setTab(1)}
              type="button"
            >
              <div styleName="content">Pending Approvals<div styleName="select-indicator" /></div>
              {pendingApprovals.length ? (<div styleName="tag">{pendingApprovals.length}</div>) : null}
            </button>
          </div>
        ) : (<h1 styleName="header-content-1">Topcoder Timeline Wall</h1>)}

        <button
          onClick={() => {
            setShowRightFilterMobile(true);
          }}
          type="button"
          styleName="filter-dropdown hide-desktop show-mobile"
        >
          <span>{selectedFilterValue.year ? selectedFilterValue.year : ''}</span>
          <IconCheveronDownBlue />
        </button>
      </div>

      {loading ? (<LoadingIndicator />) : (
        <React.Fragment>
          <TimelineEvents
            isAuthenticated={!!authToken}
            isAdmin={isAdmin}
            events={sortedEvents}
            styleName={cn('tab-content', { hide: tab === 1, 'is-admin': role === 'Admin user' })}
            removeEvent={removeEvent}
            showRightFilterMobile={showRightFilterMobile}
            setShowRightFilterMobile={setShowRightFilterMobile}
            selectedFilterValue={selectedFilterValue}
            setSelectedFilterValue={setSelectedFilterValue}
            createNewEvent={(body) => {
              createNewEvent(authToken, body);
            }}
            onDoneAddEvent={() => {
              getTimelineEvents();
            }}
            getAvatar={getAvatar}
            userAvatars={userAvatars}
            uploading={uploading}
          />
          <React.Fragment>
            {
              loading ? (
                <LoadingIndicator />
              ) : (
                <PendingApprovals
                  events={pendingApprovals}
                  styleName={cn('tab-content', { hide: tab === 0, 'is-admin': role === 'Admin user' })}
                  removeEvent={removeEvent}
                  userAvatars={userAvatars}
                  deleteEvent={deleteEvent}
                  onApproveEvent={onApproveEvent}
                />
              )
            }
          </React.Fragment>
        </React.Fragment>
      )}
    </div>
  );
}

/**
 * Default values for Props
 */
TimelineWallContainer.defaultProps = {
  auth: null,
  isAdmin: false,
  loading: false,
  uploading: false,
  events: [],
  userAvatars: {},
  pendingApprovals: [],
};

/**
 * Prop Validation
 */
TimelineWallContainer.propTypes = {
  auth: PT.shape(),
  isAdmin: PT.bool,
  loading: PT.bool,
  uploading: PT.bool,
  events: PT.arrayOf(PT.shape()),
  loadUserDetails: PT.func.isRequired,
  createNewEvent: PT.func.isRequired,
  getTimelineEvents: PT.func.isRequired,
  getPendingApprovals: PT.func.isRequired,
  getAvatar: PT.func.isRequired,
  userAvatars: PT.shape(),
  pendingApprovals: PT.arrayOf(PT.shape()),
};

const mapStateToProps = state => ({
  auth: {
    ...state.auth,
  },
  isAdmin: state.timelineWall.isAdmin,
  loading: state.timelineWall.loading,
  uploading: state.timelineWall.uploading,
  events: state.timelineWall.events,
  userAvatars: state.timelineWall.userAvatars,
  pendingApprovals: state.timelineWall.pendingApprovals,
});

function mapDispatchToProps(dispatch) {
  return {
    loadUserDetails: (tokenV3) => {
      dispatch(timelineActions.timeline.getUserDetailsInit());
      dispatch(timelineActions.timeline.getUserDetailsDone(tokenV3));
    },
    createNewEvent: (tokenV3, body) => {
      dispatch(timelineActions.timeline.createNewEventInit());
      dispatch(timelineActions.timeline.createNewEventDone(tokenV3, body));
    },
    getTimelineEvents: () => {
      dispatch(timelineActions.timeline.fetchTimelineEventsInit());
      dispatch(timelineActions.timeline.fetchTimelineEventsDone());
    },
    getPendingApprovals: (tokenV3) => {
      dispatch(timelineActions.timeline.fetchPendingApprovalsInit());
      dispatch(timelineActions.timeline.fetchPendingApprovalsDone(tokenV3));
    },
    getAvatar: (handle) => {
      dispatch(timelineActions.timeline.fetchUserAvatarInit(handle));
      dispatch(timelineActions.timeline.fetchUserAvatarDone(handle));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineWallContainer);
