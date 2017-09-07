/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Registrants tab component.
 */

import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import config from 'utils/config';

import CheckMark from '../icons/check-mark.svg';
import './style.scss';

function formatDate(date) {
  if (!date) return '-';
  return `${moment(date).format('MMM DD, YYYY HH:mm')} EDT`;
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

export default function Registrants(props) {
  const {
    registrants,
    isDesign,
    checkpoints,
    results,
    submissions,
    checkpointResults,
    places,
  } = props;

  registrants.sort((a, b) => new Date(a.registrationDate).getTime()
    - new Date(b.registrationDate).getTime());

  return (
    <div styleName={cn(['container', { design: isDesign }])}>
      <div styleName="head">
        <div styleName="col-1">Username</div>
        <div styleName="col-2">Registration Date</div>
        {isDesign && <div styleName="col-3">Round 1 Submitted Date</div>}
        <div styleName="col-4">{isDesign ? 'Round 2 Submitted Date' : 'Submitted Date'}</div>
      </div>
      <div styleName="body">
        {
          registrants.map((r) => {
            const placement = getPlace(results, r.handle, places);
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
                  isDesign &&
                  <div styleName="col-3">
                    <div styleName="sm-only title">Round 1 Submitted Date</div>
                    <div>
                      <span>
                        {formatDate(getDate(checkpoints, r.handle))}
                      </span>
                      {
                        passedCheckpoint(checkpoints, r.handle, checkpointResults) &&
                        <CheckMark styleName="passed" />
                      }
                    </div>
                  </div>
                }
                <div styleName="col-4">
                  <div styleName="sm-only title">{isDesign ? 'Round 2 ' : ''}Submitted Date</div>
                  <div>
                    <span>
                      {formatDate(getDate(submissions, r.handle) || r.submissionDate)}
                    </span>
                    {placement > 0 && <span styleName={cn(['placement', {
                      'placement-1': placement === 1,
                      'placement-2': placement === 2,
                      'placement-3': placement === 3 }])}
                    >{placement}</span>}
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
  registrants: [],
  isDesign: false,
  checkpoints: [],
  results: [],
  submissions: [],
  checkpointResults: [],
  places: 0,
};

Registrants.propTypes = {
  registrants: PT.arrayOf(PT.shape()),
  checkpoints: PT.arrayOf(PT.shape()),
  results: PT.arrayOf(PT.shape()),
  submissions: PT.arrayOf(PT.shape()),
  checkpointResults: PT.arrayOf(PT.shape()),
  isDesign: PT.bool,
  places: PT.number,
};
