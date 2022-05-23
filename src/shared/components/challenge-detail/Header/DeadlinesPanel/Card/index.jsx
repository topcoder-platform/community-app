/**
 * A single deadline card.
 */

import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import CalendarIcon from 'assets/images/icon-calendar-2.svg';
import CalendarIconActive from 'assets/images/icon-calendar-2-active.svg';
import TimeIcon from 'assets/images/icon-time.svg';
import TimeIconActive from 'assets/images/icon-time-active.svg';

import './style.scss';

/* Date/time format to use in the card. */
const FORMAT_YEAR = 'MMM DD, YYYY';
const TIME = 'HH:mm';

export default function Card({ past, time, title }) {
  const time2 = moment(time);
  const past2 = past === null ? time2.isBefore(moment()) : past;
  return (
    <div styleName={past2 ? 'past' : 'open'}>
      <p styleName="title">
        {title}
      </p>
      <div>
        <p styleName="date">
          { past2 ? <CalendarIcon /> : <CalendarIconActive /> }
          <span>
            {time2.format(FORMAT_YEAR)}
          </span>
        </p>
        <p styleName="time">
          { past2 ? <TimeIcon /> : <TimeIconActive /> }
          <span>
            {time2.format(TIME)}
          </span>
        </p>
      </div>
    </div>
  );
}

Card.defaultProps = {
  past: null,
};

Card.propTypes = {
  past: PT.bool,
  title: PT.string.isRequired,
  time: PT.string.isRequired,
};
