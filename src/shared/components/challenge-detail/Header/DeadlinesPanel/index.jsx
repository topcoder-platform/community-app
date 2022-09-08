/**
 * Deadlines panel.
 */

import moment from 'moment-timezone';
import PT from 'prop-types';
import React from 'react';

import { phaseEndDate, phaseStartDate } from 'utils/challenge-listing/helper';
import Card from './Card';
import './style.scss';

export default function DeadlinesPanel({ deadlines }) {
  let hasSubmissionPhase = false;

  const getCardProps = (deadline, index) => {
    let { name } = deadline;
    let showRange = true;
    name = name.replace(/\bCheckpoint\b/, 'Checkpoint');
    if (/.+submission/i.test(name)) {
      hasSubmissionPhase = true;
      name = name.replace(/submission/i, 'Round');
    } else {
      switch (name) {
        case 'Submission':
          name = hasSubmissionPhase ? 'Finals' : 'Submission';
          break;
        case 'Review':
          name = hasSubmissionPhase ? 'Finals Review' : name;
          break;
        case 'Appeals':
          name = hasSubmissionPhase ? 'Appeals Due' : name;
          break;
        default:
      }
    }
    if (index === deadlines.length - 1) {
      name = 'Winners Announced';
      showRange = false;
    }

    const start = phaseStartDate(deadline);
    const end = phaseEndDate(deadline);

    return {
      name, start, end, showRange,
    };
  };

  return (
    <div styleName="panel left" tabIndex="0" role="tabpanel">
      <p styleName="timezone">
        Timezone:
        {moment.tz.guess()}
      </p>
      { deadlines.map((d, index) => {
        const {
          name, start, end, showRange,
        } = getCardProps(d, index);
        return (
          <Card
            key={d.name}
            title={name}
            start={start}
            end={end}
            showRange={showRange}
          />
        );
      })}
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
