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
  start = start.actualStartTime || start.scheduledStartTime;
  const started = moment(start).isBefore(moment());

  return (
    <div styleName="panel" tabIndex="0">
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
          key={d.phaseType}
          time={d.actualEndTime || d.scheduledEndTime}
          title={index === deadlines.length - 1 ? 'Winners' : d.phaseType}
        />
      ))}
    </div>
  );
}

DeadlinesPanel.propTypes = {
  deadlines: PT.arrayOf(PT.shape({
    actualEndTime: PT.string,
    actualStartTime: PT.string,
    phaseType: PT.string.isRequired,
    scheduledEndTime: PT.string.isRequired,
    scheduledStartTime: PT.string.isRequired,
  })).isRequired,
};
