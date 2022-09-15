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

export default function Card({
  title, start, end, showRange,
}) {
  const startMoment = moment(start);
  const endMoment = moment(end);
  const past = endMoment.isBefore(moment());
  return (
    <div styleName={past ? 'past' : 'open'}>
      <p styleName="title">
        {title}
      </p>
      <p styleName="sections">
        {showRange ? (
          <section styleName="section">
            <span styleName="section-title">Starts</span>
            <p styleName="date">
              { past ? <CalendarIcon /> : <CalendarIconActive /> }
              <span>
                {startMoment.format(FORMAT_YEAR)}
              </span>
            </p>
            <p styleName="time">
              { past ? <TimeIcon /> : <TimeIconActive /> }
              <span>
                {startMoment.format(TIME)}
              </span>
            </p>
          </section>
        ) : null}
        <section styleName="section">
          {showRange ? <span styleName="section-title">Ends</span> : null}
          <p styleName="date">
            { past ? <CalendarIcon /> : <CalendarIconActive /> }
            <span>
              {endMoment.format(FORMAT_YEAR)}
            </span>
          </p>
          <p styleName="time">
            { past ? <TimeIcon /> : <TimeIconActive /> }
            <span>
              {endMoment.format(TIME)}
            </span>
          </p>
        </section>
      </p>
    </div>
  );
}

Card.propTypes = {
  title: PT.string.isRequired,
  start: PT.string.isRequired,
  end: PT.string.isRequired,
  showRange: PT.bool.isRequired,
};
