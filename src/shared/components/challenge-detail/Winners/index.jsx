/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Winners tab component.
 */

import React, { useState } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { services } from 'topcoder-react-lib';
import { CHALLENGE_STATUS } from 'utils/tc';
import { getMMSubmissionId } from 'utils/submissions';
import { compressFiles } from 'utils/files';
import Winner from './Winner';
import './style.scss';

const { getService } = services.submissions;

export default function Winners({
  winners,
  prizes,
  isFunChallenge,
  submissions,
  viewable,
  isDesign,
  isMM,
  isRDM,
  isLoggedIn,
  auth,
  challengeStatus,
}) {
  // todo: hide download button until update submissions API
  const hideDownloadForMMRDM = true;
  const [downloadingAll, setDownloadingAll] = useState(false);
  const showWinnerHeader = prizes.length > 0 && prizes[0].type && (prizes[0].type === 'POINT');
  return (
    <div styleName="container">
      {
        !hideDownloadForMMRDM
        && ((winners.length > 0 || challengeStatus === CHALLENGE_STATUS.COMPLETED)
        && (isMM || isRDM) && isLoggedIn) && (
          <div styleName="block-download-all">
            <button
              disabled={downloadingAll}
              styleName="download MM"
              onClick={() => {
                // download submission
                setDownloadingAll(true);
                const submissionsService = getService(auth.m2mToken);
                const allFiles = [];
                let downloadedFile = 0;
                const checkToCompressFiles = () => {
                  if (downloadedFile === winners.length) {
                    if (downloadedFile > 0) {
                      compressFiles(allFiles, 'all-winners-submissions.zip', () => {
                        setDownloadingAll(false);
                      });
                    } else {
                      setDownloadingAll(false);
                    }
                  }
                };
                checkToCompressFiles();
                _.forEach(winners, (winner) => {
                  const mmSubmissionId = getMMSubmissionId(submissions, winner.handle);
                  submissionsService.downloadSubmission(mmSubmissionId)
                    .then((blob) => {
                      const file = new File([blob], `submission-${mmSubmissionId}.zip`);
                      allFiles.push(file);
                      downloadedFile += 1;
                      checkToCompressFiles();
                    }).catch(() => {
                      downloadedFile += 1;
                      checkToCompressFiles();
                    });
                });
              }}
              type="button"
            >
              Download All
            </button>
          </div>
        )
      }
      {
        // Show the new "Points" header when we have a points challenge
        showWinnerHeader && (
          <span styleName="winner-title">Points</span>
        )
      }
      {
        winners.map(w => (
          <Winner
            isDesign={isDesign}
            isMM={isMM}
            isRDM={isRDM}
            key={`${w.handle}-${w.placement}`}
            prizes={prizes}
            isFunChallenge={isFunChallenge}
            submissions={submissions}
            viewable={viewable}
            winner={w}
            isLoggedIn={isLoggedIn}
            auth={auth}
          />
        ))
      }
    </div>
  );
}

Winners.defaultProps = {
  winners: [],
  prizes: [],
  isFunChallenge: false,
  submissions: [],
  viewable: false,
  isDesign: false,
  isMM: false,
  isRDM: false,
  isLoggedIn: false,
  challengeStatus: '',
};

Winners.propTypes = {
  winners: PT.arrayOf(PT.shape()),
  prizes: PT.arrayOf(PT.shape()),
  isFunChallenge: PT.bool,
  submissions: PT.arrayOf(PT.shape()),
  viewable: PT.bool,
  isDesign: PT.bool,
  isMM: PT.bool,
  isRDM: PT.bool,
  isLoggedIn: PT.bool,
  challengeStatus: PT.string,
  auth: PT.shape().isRequired,
};
