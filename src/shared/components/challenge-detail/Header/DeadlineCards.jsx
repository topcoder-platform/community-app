/*
  Component that renders all phases/deadlines for a given challenge
*/

import React from 'react';
import PT from 'prop-types';
import shortid from 'shortid';
import { localTime } from 'utils/tc';

import './style.scss';

function hasPassed(date) {
  return (new Date(date)).getTime() < Date.now();
}

export default function DeadlineCards(props) {
  const {
    relevantPhases,
  } = props;
  const deadlineFormat = 'MMM DD, hh:mm a';
  return (
    <div styleName="deadline-detailed">
      {
        relevantPhases.map((phase, index) => {
          const startCrossed = hasPassed(phase.actualStartTime
            || phase.scheduledStartTime);
          const startString = (startCrossed ? 'Started' : 'Starts');
          const phaseString = (index === relevantPhases.length - 1 ?
            'Winners' : phase.phaseType);
          const deadlineKey = index === 0 ? startString : phaseString;
          const endCrossed = hasPassed(phase.actualEndTime
            || phase.scheduledEndTime);
          let dateStyle = '';
          if (index === 0) {
            if (startCrossed) {
              dateStyle = 'deadline-crossed';
            } else {
              dateStyle = 'deadline-live';
            }
          } else if (endCrossed) {
            dateStyle = 'deadline-crossed';
          } else {
            dateStyle = 'deadline-live';
          }
          return (
            /* TODO: At the moment phase objects for registration phases do not
             * include "id", nor most of other fields expected from other phase
             * objects. To leverage it in a simple way, we use below shortid()
             * as the fallback for the key. It is less efficient, than using a
             * proper key, thus should be updated. */
            <div key={phase.id || shortid()} styleName="deadline-card">
              <p styleName="deadline-info">{deadlineKey}</p>
              <p styleName={`deadline-date ${dateStyle}`}>
                {
                  (index === 0 ?
                    localTime(phase.actualStartTime
                    || phase.scheduledStartTime, deadlineFormat) :
                    localTime(phase.actualEndTime
                    || phase.scheduledEndTime, deadlineFormat))
                }
              </p>
            </div>
          );
        })
      }
    </div>
  );
}

DeadlineCards.propTypes = {
  relevantPhases: PT.arrayOf(PT.object).isRequired,
};
