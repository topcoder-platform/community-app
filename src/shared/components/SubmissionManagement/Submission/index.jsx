/**
 * This component receives via props a single submission data object,
 * and showScreeningDetails boolean property, which should tell whether
 * the Screening Details component should be rendered or not
 * (and also to choose the proper orientation of arrow icon).
 *
 * Also, this component will receive the following callbacks to be triggered
 * when user clicks on buttons/icons/links:
 * onDelete() (to be triggered by delete icon),
 * onDownload() (to be triggered by download icon),
 * onShowDetails() (to be triggered by details arrow icon, and also by screening status component).
 */

import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { COMPETITION_TRACKS, CHALLENGE_STATUS, safeForDownload } from 'utils/tc';

import PT from 'prop-types';

import Tooltip from 'components/Tooltip';
import DeleteIcon from '../Icons/IconTrashSimple.svg';
import DownloadIcon from '../Icons/IconSquareDownload.svg';
import ArtifactsDownloadIcon from '../Icons/IconDownloadArtifacts.svg';
import ReviewRatingListIcon from '../Icons/IconReviewRatingList.svg';
import ExpandIcon from '../Icons/IconMinimalDown.svg';
import ScreeningStatus from '../ScreeningStatus';

import './styles.scss';


export default function Submission(props) {
  const {
    challenge,
    submissionObject,
    showScreeningDetails,
    track,
    onDownload,
    onDelete,
    onShowDetails,
    onOpenDownloadArtifactsModal,
    onOpenRatingsListModal,
    status,
    allowDelete,
  } = props;
  const formatDate = date => moment(+new Date(date)).format('MMM DD, YYYY hh:mm A');
  const onDownloadSubmission = onDownload.bind(1, submissionObject.id);
  const safeForDownloadCheck = safeForDownload(submissionObject.url);
  const onDownloadArtifacts = onOpenDownloadArtifactsModal.bind(1, submissionObject.id);
  const onOpenRatingsList = onOpenRatingsListModal.bind(1, submissionObject.id);

  // Determine if a challenge is for Topcrowd so we can edit the UI accordingly
  let isTopCrowdChallenge = false;
  if (challenge) {
    const isTopCrowdChallengeData = _.find(challenge.metadata, { name: 'is_platform' });
    if (isTopCrowdChallengeData) {
      isTopCrowdChallenge = isTopCrowdChallengeData.value;
    }
  }

  return (
    <tr styleName="submission-row">
      <td styleName="id-col">
        <span styleName="mobile-header">ID</span>
        {submissionObject.legacySubmissionId}
        <div styleName="v5-id">{submissionObject.id}</div>
      </td>
      <td styleName="type-col">
        <span styleName="mobile-header">TYPE</span>
        {submissionObject.type}
      </td>
      <td styleName="date-col">
        <span styleName="mobile-header">Submission Date</span>
        {formatDate(submissionObject.created)}
      </td>
      {
         track === COMPETITION_TRACKS.COMPETITION_TRACKS.DES && (
           <td styleName="status-col">
             <span styleName="mobile-header">Screening Status</span>
             {safeForDownloadCheck !== true ? safeForDownloadCheck : submissionObject.screening
               && (
                 <ScreeningStatus
                   screeningObject={submissionObject.screening}
                   onShowDetails={onShowDetails}
                   submissionId={submissionObject.id}
                 />
               )}
           </td>
         )
       }
      <td styleName="action-col">
        <div styleName="button-wrapper">
          { !isTopCrowdChallenge
            ? (
              <Tooltip content={() => <div styleName="tooltip-content">Download Submission</div>}>
                <button
                  onClick={() => onDownloadSubmission(submissionObject.id)}
                  type="button"
                >
                  { safeForDownloadCheck === true && <DownloadIcon /> }
                </button>
              </Tooltip>
            )
            : <span /> }
          { !isTopCrowdChallenge
            ? (
              <Tooltip content={() => <div styleName="tooltip-content">Download Submission Artifacts</div>}>
                <button
                  onClick={() => onDownloadArtifacts()}
                  type="button"
                  styleName="download-artifacts-button"
                >
                  {safeForDownloadCheck === true && <ArtifactsDownloadIcon />}
                </button>
              </Tooltip>
            )
            : <span /> }
          { !isTopCrowdChallenge
            ? (
              <Tooltip content={() => <div styleName="tooltip-content">Show Scores</div>}>
                <button
                  onClick={() => onOpenRatingsList()}
                  type="button"
                  styleName="download-artifacts-button"
                >
                  {safeForDownloadCheck === true && <ReviewRatingListIcon />}
                </button>
              </Tooltip>
            )
            : <span />}
          { /*
             TODO: At the moment we just fetch downloads from the legacy
               Topcoder Studio API, and we don't need any JS code to this.
               It may change soon, as we move to the new TC API for
               downloads. Then we'll use this commented out code or
               remove it for good.
           <button
             onClick={() => onDownload(submissionObject.id)}
           ><DownloadIcon /></button>
           */ }
          {status !== CHALLENGE_STATUS.COMPLETED
             && track === COMPETITION_TRACKS.DES
             && safeForDownloadCheck === true && (
             <button
               styleName="delete-icon"
               onClick={() => onDelete(submissionObject.id)}
               disabled={!allowDelete}
               type="button"
             >
               <DeleteIcon />
             </button>
          )
          }
          <button
            styleName={`expand-icon ${(showScreeningDetails ? 'expanded' : '')}`}
            onClick={() => onShowDetails(submissionObject.id)}
            type="button"
          >
            <ExpandIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

Submission.defaultProps = {
  submissionObject: {},
  showScreeningDetails: false,
  onShowDetails: _.noop,
  onOpenDownloadArtifactsModal: _.noop,
  onOpenRatingsListModal: _.noop,
};

Submission.propTypes = {
  challenge: PT.shape().isRequired,
  submissionObject: PT.shape({
    id: PT.string,
    legacySubmissionId: PT.string,
    warpreviewnings: PT.string,
    screening: PT.shape({
      status: PT.string,
    }),
    submitted: PT.string,
    type: PT.string,
    created: PT.any,
    download: PT.any,
    url: PT.string,
  }),
  showScreeningDetails: PT.bool,
  track: PT.string.isRequired,
  onDownload: PT.func.isRequired,
  onDelete: PT.func.isRequired,
  onShowDetails: PT.func,
  status: PT.string.isRequired,
  allowDelete: PT.bool.isRequired,
  onOpenDownloadArtifactsModal: PT.func,
  onOpenRatingsListModal: PT.func,
};
