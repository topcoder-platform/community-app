import React, { useState, useEffect } from 'react';
import TopBanner from 'assets/images/timeline-wall/top-banner.png';
import TopBannerMobile from 'assets/images/timeline-wall/top-banner-mobile.png';
import IconCheveronDownBlue from 'assets/images/timeline-wall/cheveron-down-blue.svg';
import cn from 'classnames';
import _ from 'lodash';
import Service from 'services/timeline';
import LoadingIndicator from 'components/LoadingIndicator';
import TimelineEvents from './timeline-events';
import PendingApprovals from './pending-approvals';
import ModalFakeLogin from './modal-fake-login';

import './styles.scss';

function TimelineWallContainer() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFakeLogin, setShowFakeLogin] = useState(true);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [approvalEvents, setApprovalEvents] = useState([]);
  const [role, setRole] = useState('Guest');
  const [showRightFilterMobile, setShowRightFilterMobile] = useState(false);
  const [selectedFilterValue, setSelectedFilterValue] = useState({
    year: 0,
    month: -1,
  });

  useEffect(() => {
    const ss = new Service();
    setLoading(true);
    ss.getTimelineEvents().then((events) => {
      setTimelineEvents(_.filter(events, e => e.status !== 'pending'));
      setApprovalEvents(_.filter(events, e => e.status === 'pending'));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div styleName="container">
      <div styleName="header">
        <img src={TopBanner} alt="top-banner" styleName="header-bg hide-mobile" />
        <img src={TopBannerMobile} alt="top-banner" styleName="header-bg hide-desktop show-mobile" />

        {role === 'Admin user' ? (
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
              {approvalEvents.length ? (<div styleName="tag">{approvalEvents.length}</div>) : null}
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
            role={role}
            events={timelineEvents}
            styleName={cn('tab-content', { hide: tab === 1, 'is-admin': role === 'Admin user' })}
            removeEvent={(event) => {
              setTimelineEvents(_.filter(timelineEvents, e => e.id !== event.id));
            }}
            showRightFilterMobile={showRightFilterMobile}
            setShowRightFilterMobile={setShowRightFilterMobile}
            selectedFilterValue={selectedFilterValue}
            setSelectedFilterValue={setSelectedFilterValue}
          />
          {approvalEvents.length ? (
            <PendingApprovals
              events={approvalEvents}
              styleName={cn('tab-content', { hide: tab === 0, 'is-admin': role === 'Admin user' })}
              removeEvent={(event) => {
                setApprovalEvents(_.filter(approvalEvents, e => e.id !== event.id));
              }}
            />
          ) : null}
        </React.Fragment>
      )}
      {showFakeLogin ? (
        <ModalFakeLogin onClose={(newRole) => {
          setRole(newRole);
          setShowFakeLogin(false);
        }}
        />
      ) : null}
    </div>
  );
}

/**
 * Default values for Props
 */
TimelineWallContainer.defaultProps = {
};

/**
 * Prop Validation
 */
TimelineWallContainer.propTypes = {
};

export default TimelineWallContainer;
