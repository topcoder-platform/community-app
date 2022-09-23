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
  role,
  events,
  removeEvent,
  setShowRightFilterMobile,
  showRightFilterMobile,
  selectedFilterValue,
  setSelectedFilterValue,
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
        <AddEvent events={localEvents} role={role} />
        {localEvents.length ? (
          <Events
            events={localEvents}
            role={role}
            removeEvent={(event) => {
              removeEvent(event);
            }}
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
  role: '',
  events: [],
  removeEvent: () => { },
  setShowRightFilterMobile: () => { },
  showRightFilterMobile: false,
  setSelectedFilterValue: () => { },
  selectedFilterValue: {
    year: 0,
    month: -1,
  },
};

/**
 * Prop Validation
 */
TimelineEvents.propTypes = {
  className: PT.string,
  role: PT.string,
  events: PT.arrayOf(PT.shape()),
  removeEvent: PT.func,
  setShowRightFilterMobile: PT.func,
  showRightFilterMobile: PT.bool,
  setSelectedFilterValue: PT.func,
  selectedFilterValue: PT.shape(),
};

export default TimelineEvents;
