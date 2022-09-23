import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import './styles.scss';
import EventItem from './event-item';

const colors = ['green', 'red', 'purple'];

function Events({ role, events, removeEvent }) {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [mobileItems, setMobileItems] = useState([]);

  useEffect(() => {
    let leftHeight = 135;
    let rightHeight = 56;
    const leftItemsTmp = [];
    const rightItemsTmp = [];
    const mobileItemsTmp = [];

    for (let i = 0; i < events.length;) {
      const event = events[i];
      const cellHeight = event.media.length > 0 ? 291 : 155;

      if (leftHeight <= rightHeight) {
        leftItemsTmp.push({
          ...event,
          color: colors[i % 3],
        });
        leftHeight += cellHeight;
      } else {
        rightItemsTmp.push({
          ...event,
          color: colors[i % 3],
        });
        rightHeight += cellHeight;
      }
      mobileItemsTmp.push({
        ...event,
        color: colors[i % 3],
      });
      i += 1;
    }
    setLeftItems(leftItemsTmp);
    setRightItems(rightItemsTmp);
    setMobileItems(mobileItemsTmp);
  }, [events]);

  return (
    <div styleName="container">
      <div styleName="reparator">
        <div styleName="dot" />
      </div>
      <div styleName="block-left hide-mobile">
        {leftItems.map(item => (
          <EventItem
            role={role}
            eventItem={item}
            styleName="event-item"
            isLeft
            key={item.id}
            removeEvent={() => {
              removeEvent(item);
            }}
          />
        ))}
      </div>
      <div styleName="block-right hide-mobile">
        {rightItems.map(item => (
          <EventItem
            role={role}
            eventItem={item}
            styleName="event-item"
            key={item.id}
            removeEvent={() => {
              removeEvent(item);
            }}
          />
        ))}
      </div>
      <div styleName="block-mobile hide-desktop show-mobile">
        {mobileItems.map(item => (
          <EventItem
            role={role}
            eventItem={item}
            styleName="event-item"
            key={item.id}
            removeEvent={() => {
              removeEvent(item);
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Default values for Props
 */
Events.defaultProps = {
  role: '',
  events: [],
  removeEvent: () => { },
};

/**
 * Prop Validation
 */
Events.propTypes = {
  role: PT.string,
  events: PT.arrayOf(PT.shape()),
  removeEvent: PT.func,
};

export default Events;
