/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * SubmissionRow component.
 */

import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { CHALLENGE_STATUS, getRatingLevel } from 'utils/tc';
import { Modal } from 'topcoder-react-ui-kit';
import IconClose from 'assets/images/icon-close-green.svg';
import moment from 'moment';

import FailedSubmissionTooltip from '../FailedSubmissionTooltip';
import InReview from '../../icons/in-review.svg';
import Queued from '../../icons/queued.svg';
import SubmissionHistoryRow from './SubmissionHistoryRow';

import style from './style.scss';

export default function SubmissionRow({
  isMM, openHistory, member, submissions, score, toggleHistory, challengeStatus,
  isReviewPhaseComplete, finalRank, provisionalRank, onShowPopup, rating, viewAsTable,
  numWinners, auth, isLoggedIn,
}) {
  const {
    submissionTime, provisionalScore, status, submissionId,
  } = submissions[0];
  let { finalScore } = submissions[0];
  finalScore = (!finalScore && finalScore < 0) || !isReviewPhaseComplete ? '-' : finalScore;
  let initialScore;
  if (provisionalScore >= 0 || provisionalScore === -1) {
    initialScore = provisionalScore;
  }

  const getInitialReviewResult = () => {
    const s = isMM ? _.get(score, 'provisional', initialScore) : initialScore;
    if (s && s < 0) return <FailedSubmissionTooltip />;
    switch (status) {
      case 'completed':
        return s;
      case 'in-review':
        return <InReview />;
      case 'queued':
        return <Queued />;
      case 'failed':
        return <FailedSubmissionTooltip />;
      default:
        return s;
    }
  };

  const getFinalReviewResult = () => {
    const s = isMM && isReviewPhaseComplete ? _.get(score, 'final', finalScore) : finalScore;
    if (isReviewPhaseComplete) {
      if (s && s < 0) return 0;
      return s;
    }
    return 'N/A';
  };

  return (
    <div styleName={`wrapper ${viewAsTable ? 'wrapper-as-table' : ''} `}>
      <div styleName="row">
        {
          isMM ? (
            <React.Fragment>
              <div styleName={`col-1 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
                <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>FINAL RANK</div>
                {
                    isReviewPhaseComplete ? finalRank || 'N/A' : 'N/A'
                  }
              </div>
              <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>PROVISIONAL RANK</div>
              <div styleName={`col-2 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
                <div>
                  { provisionalRank || 'N/A' }
                </div>
              </div>
            </React.Fragment>
          ) : null
        }
        <div styleName={`col-3 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
          <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>RATING</div>
          <span styleName={`col level-${getRatingLevel(rating)}`}>
            {rating || '-'}
          </span>
        </div>
        <div styleName={`col-4 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
          <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>USERNAME</div>
          <a
            href={`${window.origin}/members/${member}`}
            target={`${_.includes(window.origin, 'www') ? '_self' : '_blank'}`}
            rel="noopener noreferrer"
            styleName={`col level-${getRatingLevel(rating)}`}
          >
            {member || '-'}
          </a>
        </div>
        <div styleName={`col-5 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
          <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>FINAL SCORE</div>
          <div>
            {getFinalReviewResult()}
          </div>
        </div>
        <div styleName={`col-6 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
          <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>PROVISIONAL SCORE</div>
          <div>
            {getInitialReviewResult() ? getInitialReviewResult() : 'N/A'}
          </div>
        </div>
        <div styleName={`col-7 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
          <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>SUBMISSION DATE</div>
          <div styleName="time">
            {moment(submissionTime).format('DD MMM YYYY')} {moment(submissionTime).format('HH:mm:ss')}
          </div>
        </div>
        <div styleName={`col-8 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
          <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>ACTIONS</div>
          <a
            onClick={toggleHistory}
            onKeyPress={toggleHistory}
          >
            <span styleName="text">
              History (
              {submissions.length}
              )
            </span>
          </a>
        </div>
      </div>
      { openHistory && (
        <Modal
          onCancel={toggleHistory}
          theme={{ container: `${style.modal} ${isMM && (numWinners > 0 || challengeStatus === CHALLENGE_STATUS.COMPLETED) ? style.download : ''}` }}
        >
          <div styleName="history">
            <div styleName="header">
              <h2 styleName="title">Submission History</h2>
              <div styleName="icon" role="presentation" onClick={toggleHistory}>
                <IconClose />
              </div>
            </div>
            <hr />
            <div styleName="submission-text">
              Latest Submission: <span>{submissionId}</span>
            </div>
            <div>
              <div styleName="row no-border history-head">
                { isMM ? <div styleName="col-1 col" /> : null }
                <div styleName="col-2 col">
                  Submission
                </div>
                <div styleName="col-3 col">
                  <div styleName="col" />
                  <div styleName="col">
                    Final Score
                  </div>
                </div>
                <div styleName="col-4 col">
                  <div styleName="col">
                    Provisional Score
                  </div>
                </div>
                <div styleName="col-5 col">
                  Time
                </div>
                {
                  isMM && (numWinners > 0 || challengeStatus === CHALLENGE_STATUS.COMPLETED) && (
                    <div styleName="col-2 col center">
                      Action
                    </div>
                  )
                }
                {
                  isMM && isLoggedIn && (
                    <div styleName="col">&nbsp;</div>
                  )
                }
              </div>
            </div>
            <div styleName="table-body">
              {
                submissions.map((submissionHistory, index) => (
                  <SubmissionHistoryRow
                    isReviewPhaseComplete={isReviewPhaseComplete}
                    isMM={isMM}
                    challengeStatus={challengeStatus}
                    submission={submissions.length - index}
                    {...submissionHistory}
                    key={submissionHistory.submissionId}
                    onShowPopup={onShowPopup}
                    member={member}
                    numWinners={numWinners}
                    auth={auth}
                    isLoggedIn={isLoggedIn}
                    submissionId={submissionHistory.submissionId}
                  />
                ))
              }
            </div>
            <div styleName="close-wrapper">
              <div styleName="close-btn" onClick={toggleHistory} role="presentation">
                <span>CLOSE</span>
              </div>
            </div>
          </div>
        </Modal>
      )
          }
    </div>
  );
}

SubmissionRow.defaultProps = {
  toggleHistory: () => {},
  score: {},
  isReviewPhaseComplete: false,
  finalRank: null,
  provisionalRank: null,
  rating: null,
  isLoggedIn: false,
};

SubmissionRow.propTypes = {
  isMM: PT.bool.isRequired,
  openHistory: PT.bool.isRequired,
  member: PT.string.isRequired,
  challengeStatus: PT.string.isRequired,
  submissions: PT.arrayOf(PT.shape({
    provisionalScore: PT.oneOfType([
      PT.number,
      PT.string,
    ]),
    finalScore: PT.oneOfType([
      PT.number,
      PT.string,
    ]),
    initialScore: PT.oneOfType([
      PT.number,
      PT.string,
    ]),
    status: PT.string.isRequired,
    submissionId: PT.string.isRequired,
    submissionTime: PT.string.isRequired,
  })).isRequired,
  score: PT.shape({
    final: PT.oneOfType([
      PT.number,
      PT.string,
    ]),
    provisional: PT.oneOfType([
      PT.number,
      PT.string,
    ]),
  }),
  rating: PT.number,
  toggleHistory: PT.func,
  isReviewPhaseComplete: PT.bool,
  finalRank: PT.number,
  provisionalRank: PT.number,
  onShowPopup: PT.func.isRequired,
  viewAsTable: PT.bool.isRequired,
  isLoggedIn: PT.bool,
  numWinners: PT.number.isRequired,
  auth: PT.shape().isRequired,
};
