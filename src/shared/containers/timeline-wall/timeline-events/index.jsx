import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import AddEvent from './add-event';
import Events from './events';
import RightFilter from './right-filter';

import './styles.scss';

function TimelineEvents({
  className,
  events,
  removeEvent,
  setShowRightFilterMobile,
  showRightFilterMobile,
  selectedFilterValue,
  setSelectedFilterValue,
  isAuthenticated,
  isAdmin,
  createNewEvent,
  getAvatar,
  userAvatars,
  onDoneAddEvent,
  uploading,
  deleteEvent,
}) {
  return (
    <div className={className} styleName="container">
      <div styleName="left-content">
        <AddEvent
          events={events}
          isAuthenticated={isAuthenticated}
          createNewEvent={createNewEvent}
          isAdmin={isAdmin}
          onDoneAddEvent={onDoneAddEvent}
          uploading={uploading}
        />
        {events.length ? (
          <Events
            events={events}
            isAdmin={isAdmin}
            isAuthenticated={isAuthenticated}
            removeEvent={(event) => {
              removeEvent(event);
            }}
            getAvatar={getAvatar}
            userAvatars={userAvatars}
            deleteEvent={deleteEvent}
          />
        )
          : null}
        {!events.length && !!events.length && selectedFilterValue.month < 0 ? (
          <span styleName="text-empty-result">No events have been added for this year. Be the first who adds one.</span>
        )
          : null}
        {!events.length && !!events.length && selectedFilterValue.month >= 0 ? (
          <span styleName="text-empty-result">No events have been added for this month. Be the first who adds one.</span>
        )
          : null}
        {!events.length && !events.length ? (
          <span styleName="text-empty-result">No events have been added. Be the first who adds one.</span>
        )
          : null}
      </div>
      <RightFilter
        selectedFilterValue={selectedFilterValue}
        setSelectedFilterValue={(newFilter) => {
          setSelectedFilterValue(newFilter);
          setShowRightFilterMobile(false);
        }}
        styleName={cn({
          'hide-mobile': !showRightFilterMobile,
        })}
      />
    </div>
  );
}

/**
 * Default values for Props
 */
TimelineEvents.defaultProps = {
  className: '',
  events: [],
  removeEvent: () => { },
  setShowRightFilterMobile: () => { },
  showRightFilterMobile: false,
  setSelectedFilterValue: () => { },
  selectedFilterValue: {
    year: 0,
    month: -1,
  },
  isAuthenticated: false,
  isAdmin: false,
  userAvatars: {},
  uploading: false,
};

/**
 * Prop Validation
 */
TimelineEvents.propTypes = {
  className: PT.string,
  events: PT.arrayOf(PT.shape()),
  removeEvent: PT.func,
  setShowRightFilterMobile: PT.func,
  showRightFilterMobile: PT.bool,
  setSelectedFilterValue: PT.func,
  selectedFilterValue: PT.shape(),
  isAuthenticated: PT.bool,
  isAdmin: PT.bool,
  createNewEvent: PT.func.isRequired,
  getAvatar: PT.func.isRequired,
  onDoneAddEvent: PT.func.isRequired,
  userAvatars: PT.shape(),
  uploading: PT.bool,
  deleteEvent: PT.func.isRequired,
};

export default TimelineEvents;
