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
  submissions,
  viewable,
  isDesign,
  isMM,
  isLoggedIn,
  auth,
  challengeStatus,
}) {
  const [downloadingAll, setDownloadingAll] = useState(false);
  return (
    <div styleName="container">
      {
        ((winners.length > 0 || challengeStatus === CHALLENGE_STATUS.COMPLETED)
        && isMM && isLoggedIn) && (
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
        winners.map(w => (
          <Winner
            isDesign={isDesign}
            isMM={isMM}
            key={`${w.handle}-${w.placement}`}
            prizes={prizes}
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
  submissions: [],
  viewable: false,
  isDesign: false,
  isMM: false,
  isLoggedIn: false,
  challengeStatus: '',
};

Winners.propTypes = {
  winners: PT.arrayOf(PT.shape()),
  prizes: PT.arrayOf(PT.shape()),
  submissions: PT.arrayOf(PT.shape()),
  viewable: PT.bool,
  isDesign: PT.bool,
  isMM: PT.bool,
  isLoggedIn: PT.bool,
  challengeStatus: PT.string,
  auth: PT.shape().isRequired,
};
