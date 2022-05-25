/* eslint jsx-a11y/no-static-element-interactions:0 */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * SubmissionHistoryRow component.
 */

import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
// import Completed from '../../../icons/completed.svg';
import Failed from '../../../icons/failed.svg';
import InReview from '../../../icons/in-review.svg';
import Queued from '../../../icons/queued.svg';

import './style.scss';

export default function SubmissionHistoryRow({
  isMM,
  submission,
  finalScore,
  provisionalScore,
  submissionTime,
  isReviewPhaseComplete,
  status,
}) {
  const getInitialReviewResult = () => {
    if (provisionalScore && provisionalScore < 0) return <Failed />;
    switch (status) {
      case 'completed':
        return provisionalScore;
      case 'in-review':
        return <InReview />;
      case 'queued':
        return <Queued />;
      case 'failed':
        return <Failed />;
      default:
        return provisionalScore === '-' ? 'N/A' : provisionalScore;
    }
  };
  const getFinalScore = () => {
    if (isMM && finalScore && finalScore > -1 && isReviewPhaseComplete) {
      return finalScore;
    }
    return 'N/A';
  };

  return (
    <div styleName="container">
      <div styleName="row no-border">
        <div styleName="col-1 col">
          <div styleName="mobile-header">SUBMISSION</div>
          <span>{submission}</span>
        </div>
        <div styleName="col-2 col">
          <div styleName="mobile-header">FINAL SCORE</div>
          <div>
            {getFinalScore()}
          </div>
        </div>
        <div styleName="col-3 col">
          <div styleName="mobile-header">PROVISIONAL SCORE</div>
          <div>
            {getInitialReviewResult()}
          </div>
        </div>
        <div styleName={`col-4 col ${isMM ? 'mm' : ''}`}>
          <div styleName="mobile-header">TIME</div>
          <div>
            {moment(submissionTime).format('DD MMM YYYY')} {moment(submissionTime).format('HH:mm:ss')}
          </div>
        </div>
      </div>
    </div>
  );
}

SubmissionHistoryRow.defaultProps = {
  finalScore: null,
  provisionalScore: null,
  isReviewPhaseComplete: false,
};

SubmissionHistoryRow.propTypes = {
  isMM: PT.bool.isRequired,
  submission: PT.number.isRequired,
  finalScore: PT.oneOfType([
    PT.number,
    PT.string,
  ]),
  status: PT.string.isRequired,
  provisionalScore: PT.oneOfType([
    PT.number,
    PT.string,
  ]),
  submissionTime: PT.string.isRequired,
  isReviewPhaseComplete: PT.bool,
};
