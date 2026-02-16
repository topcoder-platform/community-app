/* eslint jsx-a11y/no-static-element-interactions:0 */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * SubmissionHistoryRow component.
 */

import React from 'react';
import PT from 'prop-types';
import { services } from 'topcoder-react-lib';
import moment from 'moment';
import { CHALLENGE_STATUS } from 'utils/tc';
import FailedSubmissionTooltip from '../../FailedSubmissionTooltip';
// import Completed from '../../../icons/completed.svg';
import InReview from '../../../icons/in-review.svg';
import Queued from '../../../icons/queued.svg';
import DownloadIcon from '../../../../SubmissionManagement/Icons/IconSquareDownload.svg';

import './style.scss';

const { getService } = services.submissions;

export default function SubmissionHistoryRow({
  isMM,
  isRDM,
  submission,
  finalScore,
  provisionalScore,
  submissionTime,
  createdAt,
  isReviewPhaseComplete,
  status,
  challengeStatus,
  auth,
  numWinners,
  submissionId,
  isLoggedIn,
}) {
  // todo: hide download button until update submissions API
  const hideDownloadForMMRDM = true;
  const parseScore = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };
  const provisionalScoreValue = parseScore(provisionalScore);
  const finalScoreValue = parseScore(finalScore);
  
  const timeField = isMM ? submissionTime : createdAt;
  const submissionMoment = timeField ? moment(timeField) : null;
  const submissionTimeDisplay = submissionMoment
    ? submissionMoment.format('MMM DD, YYYY HH:mm')
    : 'N/A';
  const getInitialReviewResult = () => {
    if (status === 'failed') return <FailedSubmissionTooltip />;
    if (status === 'in-review') return <InReview />;
    if (status === 'queued') return <Queued />;
    if (provisionalScoreValue === null) return 'N/A';
    if (provisionalScoreValue < 0) return <FailedSubmissionTooltip />;
    switch (status) {
      case 'completed':
        return provisionalScoreValue;
      default:
        return provisionalScoreValue;
    }
  };
  const getFinalScore = () => {
    if (!isReviewPhaseComplete) {
      return 'N/A';
    }
    if (finalScoreValue === null) {
      return 'N/A';
    }
    if (finalScoreValue < 0) {
      return 0;
    }
    return finalScoreValue;
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
        {
          isMM && (
            <div styleName="col-3 col">
              <div styleName="mobile-header">PROVISIONAL SCORE</div>
              <div>
                {getInitialReviewResult()}
              </div>
            </div>
          )
        }
        <div styleName={`${isMM ? 'col-4' : 'col-3'} col ${isMM ? 'mm' : ''}`}>
          <div styleName="mobile-header">TIME</div>
          <div>
            {submissionTimeDisplay}
          </div>
        </div>
        {
          !hideDownloadForMMRDM && isLoggedIn && (isMM || isRDM)
          && (numWinners > 0 || challengeStatus === CHALLENGE_STATUS.COMPLETED) && (
            <div styleName="col-2 col center">
              <div styleName="mobile-header">Action</div>
              <button
                onClick={() => {
                  // download submission
                  const submissionsService = getService(auth.m2mToken);
                  submissionsService.downloadSubmission(submissionId)
                    .then((blob) => {
                      const url = window.URL.createObjectURL(new Blob([blob]));
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `submission-${submissionId}.zip`);
                      document.body.appendChild(link);
                      link.click();
                      link.parentNode.removeChild(link);
                    });
                }}
                type="button"
              >
                <DownloadIcon />
              </button>
            </div>
          )
        }
      </div>
    </div>
  );
}

SubmissionHistoryRow.defaultProps = {
  finalScore: null,
  provisionalScore: null,
  isReviewPhaseComplete: false,
  isLoggedIn: false,
  createdAt: null,
};

SubmissionHistoryRow.propTypes = {
  isMM: PT.bool.isRequired,
  isRDM: PT.bool.isRequired,
  submission: PT.number.isRequired,
  finalScore: PT.oneOfType([
    PT.number,
    PT.string,
    PT.oneOf([null]),
  ]),
  status: PT.string.isRequired,
  provisionalScore: PT.oneOfType([
    PT.number,
    PT.string,
    PT.oneOf([null]),
  ]),
  submissionTime: PT.oneOfType([
    PT.string,
    PT.oneOf([null]),
  ]),
  createdAt: PT.oneOfType([
    PT.string,
    PT.oneOf([null]),
  ]),
  challengeStatus: PT.string.isRequired,
  isReviewPhaseComplete: PT.bool,
  auth: PT.shape().isRequired,
  numWinners: PT.number.isRequired,
  submissionId: PT.string.isRequired,
  isLoggedIn: PT.bool,
};
