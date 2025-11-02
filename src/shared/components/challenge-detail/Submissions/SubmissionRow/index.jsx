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
  isMM, isRDM, openHistory, member, submissions, toggleHistory, challengeStatus,
  isReviewPhaseComplete, finalRank, provisionalRank, onShowPopup, rating, viewAsTable,
  numWinners, auth, isLoggedIn,
}) {
  const submissionList = Array.isArray(submissions) ? submissions : [];
  const latestSubmission = submissionList[0] || {};
  const {
    status,
    submissionId,
    submissionTime,
  } = latestSubmission;

  const parseScore = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };

  const provisionalScore = parseScore(_.get(latestSubmission, 'provisionalScore'));
  const finalScore = parseScore(_.get(latestSubmission, 'finalScore'));

  const getInitialReviewResult = () => {
    if (status === 'failed') {
      return <FailedSubmissionTooltip />;
    }
    if (status === 'in-review') {
      return <InReview />;
    }
    if (status === 'queued') {
      return <Queued />;
    }
    if (_.isNil(provisionalScore)) {
      return 'N/A';
    }
    if (provisionalScore < 0) {
      return <FailedSubmissionTooltip />;
    }
    return provisionalScore;
  };

  const getFinalReviewResult = () => {
    if (!isReviewPhaseComplete) {
      return 'N/A';
    }
    if (_.isNil(finalScore)) {
      return 'N/A';
    }
    if (finalScore < 0) {
      return 0;
    }
    return finalScore;
  };

  const initialReviewResult = getInitialReviewResult();
  const finalReviewResult = getFinalReviewResult();

  const submissionMoment = submissionTime ? moment(submissionTime) : null;
  const submissionDateDisplay = submissionMoment
    ? `${submissionMoment.format('DD MMM YYYY')} ${submissionMoment.format('HH:mm:ss')}`
    : 'N/A';

  const finalRankDisplay = (isReviewPhaseComplete && _.isFinite(finalRank)) ? finalRank : 'N/A';
  const provisionalRankDisplay = _.isFinite(provisionalRank) ? provisionalRank : 'N/A';
  const ratingDisplay = _.isFinite(rating) ? rating : '-';
  const ratingLevelStyle = `col level-${getRatingLevel(rating)}`;
  const memberHandle = member || '';
  const memberDisplay = memberHandle || '-';
  const memberProfileUrl = memberHandle ? `${window.origin}/members/${memberHandle}` : null;
  const memberLinkTarget = `${_.includes(window.origin, 'www') ? '_self' : '_blank'}`;
  const memberForHistory = memberHandle || memberDisplay;
  const latestSubmissionId = submissionId || 'N/A';
  const submissionCount = submissionList.length;

  return (
    <div styleName={`wrapper ${viewAsTable ? 'wrapper-as-table' : ''} `}>
      <div styleName="row">
        {
          isMM ? (
            <React.Fragment>
              <div styleName={`col-1 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
                <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>FINAL RANK</div>
                {finalRankDisplay}
              </div>
              <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>PROVISIONAL RANK</div>
              <div styleName={`col-2 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
                <div>
                  { provisionalRankDisplay }
                </div>
              </div>
            </React.Fragment>
          ) : null
        }
        <div styleName={`col-3 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
          <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>RATING</div>
          <span styleName={ratingLevelStyle}>
            {ratingDisplay}
          </span>
        </div>
        <div styleName={`col-4 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
          <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>USERNAME</div>
          {
            memberProfileUrl ? (
              <a
                href={memberProfileUrl}
                target={memberLinkTarget}
                rel="noopener noreferrer"
                styleName={ratingLevelStyle}
              >
                {memberDisplay}
              </a>
            ) : (
              <span styleName={ratingLevelStyle}>{memberDisplay}</span>
            )
          }
        </div>
        <div styleName={`col-5 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
          <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>FINAL SCORE</div>
          <div>
            {finalReviewResult}
          </div>
        </div>
        <div styleName={`col-6 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
          <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>PROVISIONAL SCORE</div>
          <div>
            {initialReviewResult}
          </div>
        </div>
        <div styleName={`col-7 col ${viewAsTable ? 'col-view-as-table' : ''}`}>
          <div styleName={viewAsTable ? 'view-as-table-header' : 'mobile-header'}>SUBMISSION DATE</div>
          <div styleName="time">
            {submissionDateDisplay}
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
              {submissionCount}
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
              Latest Submission: <span>{latestSubmissionId}</span>
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
                  (isMM || isRDM)
                  && (numWinners > 0 || challengeStatus === CHALLENGE_STATUS.COMPLETED) && (
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
                submissionList.map((submissionHistory, index) => (
                  <SubmissionHistoryRow
                    isReviewPhaseComplete={isReviewPhaseComplete}
                    isMM={isMM}
                    isRDM={isRDM}
                    challengeStatus={challengeStatus}
                    submission={submissionList.length - index}
                    {...submissionHistory}
                    key={submissionHistory.submissionId || index}
                    onShowPopup={onShowPopup}
                    member={memberForHistory}
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
  isReviewPhaseComplete: false,
  finalRank: null,
  provisionalRank: null,
  rating: null,
  isLoggedIn: false,
};

SubmissionRow.propTypes = {
  isMM: PT.bool.isRequired,
  isRDM: PT.bool.isRequired,
  openHistory: PT.bool.isRequired,
  member: PT.string.isRequired,
  challengeStatus: PT.string.isRequired,
  submissions: PT.arrayOf(PT.shape({
    provisionalScore: PT.oneOfType([
      PT.number,
      PT.string,
      PT.oneOf([null]),
    ]),
    finalScore: PT.oneOfType([
      PT.number,
      PT.string,
      PT.oneOf([null]),
    ]),
    status: PT.string.isRequired,
    submissionId: PT.string.isRequired,
    submissionTime: PT.oneOfType([
      PT.string,
      PT.oneOf([null]),
    ]).isRequired,
  })).isRequired,
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
