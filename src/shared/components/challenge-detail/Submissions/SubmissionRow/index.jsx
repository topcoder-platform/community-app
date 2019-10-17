/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * SubmissionRow component.
 */

import React from 'react';
import PT from 'prop-types';
import { get } from 'lodash';
import { config } from 'topcoder-react-utils';
import moment from 'moment';
import ArrowNext from '../../../../../assets/images/arrow-next.svg';
import Failed from '../../icons/failed.svg';
import InReview from '../../icons/in-review.svg';
import Queued from '../../icons/queued.svg';
import SubmissionHistoryRow from './SubmissionHistoryRow';

import './style.scss';

export default function SubmissionRow({
  isMM, openHistory, member, submissions, score, toggleHistory, colorStyle,
  isReviewPhaseComplete, finalRank, provisionalRank, onShowPopup,
}) {
  const {
    submissionTime, provisionalScore, status,
  } = submissions[0];
  let { finalScore } = submissions[0];
  finalScore = (!finalScore && finalScore < 0) || !isReviewPhaseComplete ? '-' : finalScore;
  let initialScore;
  if (provisionalScore && (provisionalScore >= 0 || provisionalScore === -1)) {
    initialScore = provisionalScore;
  }

  const getInitialReviewResult = () => {
    const s = isMM ? get(score, 'provisional', initialScore) : initialScore;
    if (s && s < 0) return <Failed />;
    switch (status) {
      case 'completed':
        return s;
      case 'in-review':
        return <InReview />;
      case 'queued':
        return <Queued />;
      case 'failed':
        return <Failed />;
      default:
        return s;
    }
  };

  return (
    <div styleName="container">
      <div styleName="row">
        {
          isMM ? (
            <div styleName="col-1 col">
              <div styleName="col col-left">
                {
                  isReviewPhaseComplete ? finalRank || '-' : '-'
                }
              </div>
              <div styleName="col">
                { provisionalRank || '-' }
              </div>
            </div>
          ) : null
        }
        <div styleName="col-2 col">
          <a href={`${config.URL.BASE}/member-profile/${member}/develop`} target="_blank" rel="noopener noreferrer" style={colorStyle}>
            {member}
          </a>
        </div>
        <div styleName="col-3 col">
          <div styleName="col col-left">
            { isMM && isReviewPhaseComplete ? get(score, 'final', finalScore) : finalScore }
          </div>
          <div styleName="col">
            {getInitialReviewResult()}
          </div>
          <div styleName="col time">
            {moment(submissionTime).format('DD MMM YYYY')} {moment(submissionTime).format('HH:mm:ss')}
          </div>
        </div>
        <div styleName="col-4 col">
          <a
            onClick={toggleHistory}
            onKeyPress={toggleHistory}
          >
            <span>
              <span styleName="text">
                History (
                {submissions.length}
                )
              </span>
              { openHistory ? (<ArrowNext styleName="icon down" />) : (<ArrowNext styleName="icon" />)}
            </span>
          </a>
        </div>
      </div>
      {openHistory
      && (
        <div styleName="history">
          <div>
            <div styleName="row no-border history-head">
              { isMM ? <div styleName="col-1 col" /> : null }
              <div styleName="col-2 col">
                Submission
              </div>
              <div styleName="col-3 col">
                <div styleName="col" />
                <div styleName="col">
                  Final
                </div>
                <div styleName="col">
                  Provisional
                </div>
              </div>
              <div styleName={`col-4 col ${isMM ? 'mm' : ''}`}>
                Time
              </div>
              {
                isMM && (
                  <div styleName="col-5 col">&nbsp;</div>
                )
              }
            </div>
          </div>
          {
            submissions.map((submissionHistory, index) => (
              <SubmissionHistoryRow
                isReviewPhaseComplete={isReviewPhaseComplete}
                isMM={isMM}
                submission={submissions.length - index}
                {...submissionHistory}
                key={submissionHistory.submissionId}
                onShowPopup={onShowPopup}
                member={member}
              />
            ))
          }
        </div>
      )
      }
    </div>
  );
}

SubmissionRow.defaultProps = {
  toggleHistory: () => {},
  colorStyle: {},
  score: {},
  isReviewPhaseComplete: false,
  finalRank: null,
  provisionalRank: null,
};

SubmissionRow.propTypes = {
  isMM: PT.bool.isRequired,
  openHistory: PT.bool.isRequired,
  member: PT.string.isRequired,
  submissions: PT.arrayOf(PT.shape({
    provisionalScore: PT.number,
    finalScore: PT.number,
    initialScore: PT.number,
    status: PT.string.isRequired,
    submissionId: PT.string.isRequired,
    submissionTime: PT.string.isRequired,
  })).isRequired,
  score: PT.shape({
    final: PT.number,
    provisional: PT.number,
  }),
  toggleHistory: PT.func,
  colorStyle: PT.shape(),
  isReviewPhaseComplete: PT.bool,
  finalRank: PT.number,
  provisionalRank: PT.number,
  onShowPopup: PT.func.isRequired,
};
