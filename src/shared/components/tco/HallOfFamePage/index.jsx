/**
 * TCO Hall of Fame Page.  Allow user to select a TCO event and view the winners, contestants
 * and other information about the event.
 */
// import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

// import events from 'utils/hall-of-fame';

import EventCarousel from './EventCarousel';

import './styles.scss';

const HallOfFamePage = ({ eventId, onSelectEvent }) => (
  <div styleName="outer-container">
    <div styleName="page">

      <div styleName="header">
        <h1>TCO Hall of Fame</h1>
        <EventCarousel eventId={eventId} onSelectEvent={onSelectEvent} />
      </div>

      <div styleName="body">
        <div styleName="event">
          Event Here
        </div>
        <div styleName="finalists">
          Finalists Here
        </div>
        <div styleName="trip-winners">
          Trip Winners Here
        </div>
      </div>

      <div styleName="fun-facts">
        Fun Facts Here
      </div>

      <div styleName="champions">
        All-Time Champions Here
      </div>

    </div>
  </div>
);

HallOfFamePage.defaultProps = {
  eventId: '17',
};

HallOfFamePage.propTypes = {
  eventId: PT.string,
  onSelectEvent: PT.func.isRequired,
};

export default HallOfFamePage;
