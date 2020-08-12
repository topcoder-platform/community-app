/**
 * Deadlines panel.
 */

import moment from 'moment-timezone';
import PT from 'prop-types';
import React from 'react';

import Card from './Card';
import './style.scss';

export default function DeadlinesPanel({ deadlines }) {
  /* Calculates challenge start time. */
  let start = deadlines[0] || {};
  start = start.actualStartDate || start.scheduledStartDate;
  const started = moment(start).isBefore(moment());

  return (
    <div styleName="panel" tabIndex="0" role="tabpanel">
      <p styleName="timezone">
        Timezone:
        {moment.tz.guess()}
      </p>
      <Card
        past={started}
        time={start}
        title={started ? 'Started' : 'Starts'}
      />
      { deadlines.map((d, index) => (
        <Card
          key={d.name}
          time={d.scheduledEndDate || d.actualEndDate}
          title={index === deadlines.length - 1 ? 'Winners' : d.name}
        />
      ))}
    </div>
  );
}

DeadlinesPanel.propTypes = {
  deadlines: PT.arrayOf(PT.shape({
    actualEndDate: PT.string,
    actualStartDate: PT.string,
    scheduledEndDate: PT.string,
    scheduledStartDate: PT.string,
  })).isRequired,
};
