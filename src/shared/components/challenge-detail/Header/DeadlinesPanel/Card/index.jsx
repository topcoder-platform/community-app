/**
 * A single deadline card.
 */

import moment from 'moment';
import PT from 'prop-types';
import React from 'react';

import './style.scss';

/* Date/time format to use in the card. */
const FORMAT = 'MMM DD, HH:mm';

export default function Card({ past, time, title }) {
  const time2 = moment(time);
  const past2 = past === null ? time2.isBefore(moment()) : past;
  return (
    <div styleName={past2 ? 'past' : 'open'}>
      <p styleName="title">{title}</p>
      <p styleName="date">{time2.format(FORMAT)}</p>
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
