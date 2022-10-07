import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
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
}) {
  const [localEvents, setLocalEvents] = useState([]);

  useEffect(() => {
    setLocalEvents(_.filter(events, (event) => {
      const eventDate = moment(event.eventDate);
      if (!selectedFilterValue.year) {
        return true;
      }
      if (eventDate.year() !== selectedFilterValue.year) {
        return false;
      }
      if (selectedFilterValue.month < 0) {
        return true;
      }
      if (eventDate.month() !== selectedFilterValue.month) {
        return false;
      }

      return true;
    }));
  }, [events, selectedFilterValue]);

  return (
    <div className={className} styleName="container">
      <div styleName="left-content">
        <AddEvent
          events={localEvents}
          isAuthenticated={isAuthenticated}
          createNewEvent={createNewEvent}
          isAdmin={isAdmin}
        />
        {localEvents.length ? (
          <Events
            events={localEvents}
            isAdmin={isAdmin}
            isAuthenticated={isAuthenticated}
            removeEvent={(event) => {
              removeEvent(event);
            }}
            getAvatar={getAvatar}
            userAvatars={userAvatars}
          />
        )
          : null}
        {!localEvents.length && !!events.length && selectedFilterValue.month < 0 ? (
          <span styleName="text-empty-result">No events have been added for this year. Be the first who adds one.</span>
        )
          : null}
        {!localEvents.length && !!events.length && selectedFilterValue.month >= 0 ? (
          <span styleName="text-empty-result">No events have been added for this month. Be the first who adds one.</span>
        )
          : null}
        {!localEvents.length && !events.length ? (
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
  userAvatars: PT.shape(),
};

export default TimelineEvents;
