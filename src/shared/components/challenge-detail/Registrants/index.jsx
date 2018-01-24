/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Registrants tab component.
 */

import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import config from 'utils/config';

import CheckMark from '../icons/check-mark.svg';
import './style.scss';

function formatDate(date) {
  if (!date) return '-';
  return moment(date).format('MMM DD, YYYY HH:mm');
}

function getDate(arr, handle) {
  const results = arr.filter(a => (a.submitter || a.handle) === handle)
    .sort((a, b) => new Date(b.submissionTime || b.submissionDate).getTime() -
      new Date(a.submissionTime || a.submissionDate).getTime());
  return results[0] ? (results[0].submissionTime || results[0].submissionDate) : '';
}

function passedCheckpoint(checkpoints, handle, results) {
  const mine = checkpoints.filter(c => c.submitter === handle);
  return _.some(mine, m => _.find(results, r => r.submissionId === m.submissionId));
}

function getPlace(results, handle, places) {
  const found = _.find(results, w => w.handle === handle
    && w.placement <= places && w.submissionStatus !== 'Failed Review');

  if (found) {
    return found.placement;
  }
  return -1;
}

export default function Registrants({ challenge, checkpointResults, results }) {
  const {
    checkpoints,
    prizes,
    registrants,
  } = challenge;

  const twoRounds = challenge.round1Introduction
    && challenge.round2Introduction;
  const places = prizes.length;

  const checkpointPhase = challenge.allPhases.find(x =>
    x.phaseType === 'Checkpoint Submission');
  const checkpointDate = moment(
    checkpointPhase ? checkpointPhase.actualEndTime || checkpointPhase.scheduledEndTime : 0,
  );

  registrants.sort((a, b) => new Date(a.registrationDate).getTime()
    - new Date(b.registrationDate).getTime());

  return (
    <div styleName={`container ${twoRounds ? 'design' : ''}`}>
      <div styleName="head">
        <div styleName="col-1">Username</div>
        <div styleName="col-2">Registration Date</div>
        {twoRounds && <div styleName="col-3">Round 1 Submitted Date</div>}
        <div styleName="col-4">{twoRounds ? 'Round 2 Submitted Date' : 'Submitted Date'}</div>
      </div>
      <div styleName="body">
        {
          registrants.map((r) => {
            const placement = getPlace(results, r.handle, places);

            let checkpoint;
            if (twoRounds) {
              checkpoint = getDate(checkpoints, r.handle);
              if (!checkpoint
              && moment(r.submissionDate).isBefore(checkpointDate)) {
                checkpoint = r.submissionDate;
              }
              checkpoint = formatDate(checkpoint);
            }

            let final = '-';
            if (moment(r.submissionDate).isAfter(checkpointDate)) {
              final = formatDate(r.submissionDate);
            }

            return (
              <div styleName="row" key={r.handle}>
                <div styleName="col-1">
                  <a href={`${config.URL.BASE}/members/${r.handle}`}>{r.handle}</a>
                </div>
                <div styleName="col-2">
                  <div styleName="sm-only title">Registration Date</div>
                  {formatDate(r.registrationDate)}
                </div>
                {
                  twoRounds &&
                  <div styleName="col-3">
                    <div styleName="sm-only title">Round 1 Submitted Date</div>
                    <div>
                      <span>{checkpoint}</span>
                      {
                        passedCheckpoint(checkpoints, r.handle, checkpointResults) &&
                        <CheckMark styleName="passed" />
                      }
                    </div>
                  </div>
                }
                <div styleName="col-4">
                  <div styleName="sm-only title">{twoRounds ? 'Round 2 ' : ''}Submitted Date</div>
                  <div>
                    <span>{final}</span>
                    {placement > 0 && <span styleName={`placement ${placement < 4 ? `placement-${placement}` : ''}`}>{placement}</span>}
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

Registrants.defaultProps = {
  results: [],
  checkpointResults: [],
};

Registrants.propTypes = {
  challenge: PT.shape({
    allPhases: PT.arrayOf(PT.shape({
      actualEndTime: PT.string,
      phaseType: PT.string.isRequired,
      scheduledEndTime: PT.string,
    })).isRequired,
    checkpoints: PT.arrayOf(PT.shape()).isRequired,
    prizes: PT.arrayOf(PT.number).isRequired,
    registrants: PT.arrayOf(PT.shape()).isRequired,
    round1Introduction: PT.string,
    round2Introduction: PT.string,
  }).isRequired,
  results: PT.arrayOf(PT.shape()),
  checkpointResults: PT.arrayOf(PT.shape()),
};
