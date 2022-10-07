import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import './styles.scss';
import EventItem from './event-item';

const colors = ['green', 'red', 'purple'];

function Events({
  events, removeEvent, isAuthenticated, getAvatar, userAvatars,
}) {
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
      const cellHeight = event.mediaFiles.length > 0 ? 291 : 155;

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
            isAuthenticated={isAuthenticated}
            eventItem={item}
            styleName="event-item"
            isLeft
            key={item.id}
            removeEvent={() => {
              removeEvent(item);
            }}
            getAvatar={getAvatar}
            userAvatars={userAvatars}
          />
        ))}
      </div>
      <div styleName="block-right hide-mobile">
        {rightItems.map(item => (
          <EventItem
            isAuthenticated={isAuthenticated}
            eventItem={item}
            styleName="event-item"
            key={item.id}
            removeEvent={() => {
              removeEvent(item);
            }}
            getAvatar={getAvatar}
            userAvatars={userAvatars}
          />
        ))}
      </div>
      <div styleName="block-mobile hide-desktop show-mobile">
        {mobileItems.map(item => (
          <EventItem
            isAuthenticated={isAuthenticated}
            eventItem={item}
            styleName="event-item"
            key={item.id}
            removeEvent={() => {
              removeEvent(item);
            }}
            getAvatar={getAvatar}
            userAvatars={userAvatars}
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
  events: [],
  removeEvent: () => { },
  isAuthenticated: false,
  userAvatars: {},
};

/**
 * Prop Validation
 */
Events.propTypes = {
  events: PT.arrayOf(PT.shape()),
  removeEvent: PT.func,
  isAuthenticated: PT.bool,
  getAvatar: PT.func.isRequired,
  userAvatars: PT.shape(),
};

export default Events;
