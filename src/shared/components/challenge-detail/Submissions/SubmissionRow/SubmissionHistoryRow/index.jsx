/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * SubmissionHistoryRow component.
 */

import React from 'react';
import PT from 'prop-types';
import moment from 'moment';

import './style.scss';

export default function SubmissionHistoryRow({
  submission,
  finalScore,
  initialScore,
  submissionTime,
}) {
  return (
    <div styleName="container">
      <div styleName="row no-border">
        <div styleName="col-1 col child" />
        <div styleName="col-2 col child">
          {submission}
        </div>
        <div styleName="col-3 col">
          <div styleName="col child">
            {(!finalScore && finalScore !== 0) ? '-' : finalScore.toFixed(2)}
          </div>
          <div styleName="col child">
            {(!initialScore && initialScore !== 0) ? '-' : initialScore.toFixed(2)}
          </div>
        </div>
        <div styleName="col-4 col history-time">
          <div styleName="col child">
            {moment(submissionTime).format('DD MMM YYYY')}
          </div>
          <div styleName="col child">
            {moment(submissionTime).format('HH:mm:ss')}
          </div>
        </div>
      </div>
    </div>
  );
}

SubmissionHistoryRow.defaultProps = {
  finalScore: null,
  initialScore: null,
};

SubmissionHistoryRow.propTypes = {
  submission: PT.number.isRequired,
  finalScore: PT.number,
  initialScore: PT.number,
  submissionTime: PT.string.isRequired,
};
