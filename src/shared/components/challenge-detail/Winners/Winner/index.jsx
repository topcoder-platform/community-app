import { Avatar } from 'topcoder-react-ui-kit';
import PT from 'prop-types';
import { services } from 'topcoder-react-lib';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { config } from 'topcoder-react-utils';
import { formatOrdinals, numberWithCommas } from 'utils/challenge-detail/helper';
import { getMMSubmissionId } from 'utils/submissions';
import DownloadIcon from '../../../SubmissionManagement/Icons/IconSquareDownload.svg';

import style from './style.scss';

const { getService } = services.submissions;

function getId(submissions, placement) {
  return submissions.find(s => s.placement === placement).submissionId;
}

export default function Winner({
  isDesign,
  isMM,
  isRDM,
  prizes,
  submissions,
  viewable,
  winner,
  isLoggedIn,
  auth,
}) {
  // todo: hide download button until update submissions API
  const hideDownloadForMMRDM = true;
  const [windowOrigin, setWindowOrigin] = useState();
  useEffect(() => {
    setWindowOrigin(window.origin);
  }, []);

  const submissionId = viewable && getId(submissions, winner.placement);
  const mmSubmissionId = (isMM || isRDM) && getMMSubmissionId(submissions, winner.handle);

  let avatarUrl = winner.photoURL;
  if (avatarUrl) {
    avatarUrl = `${config.CDN.PUBLIC}/avatar/${
      encodeURIComponent(avatarUrl)}?size=65`;
  }

  let prize = 'N/A';
  // Default to USD for the prize type for now
  let prizeType = "USD";
  const prizeIndex = parseInt(winner.placement, 10) - 1;
  if (prizes[prizeIndex]){
    prize = prizes[prizeIndex].value;
    prizeType = prizes[prizeIndex].type;
  }

  // Handle point prizes on the winners display
  let prizeText = "";
  if (prizeType === "POINT"){
    prizeText = numberWithCommas(prize)
  }
  else{
    prizeText = "$" + numberWithCommas(prize)
  }

  return (
    <div styleName="winner">
      <div styleName="left">
        <div styleName={`placement ${(winner.placement && winner.placement < 4) ? `placement-${winner.placement}` : ''}`}>
          <span>{formatOrdinals(winner.placement)}</span>
        </div>
        <div styleName="info">
          <div styleName="avatar-prize">
            <Avatar
              theme={{ avatar: style.avatar }}
              url={avatarUrl}
            />
            <div>
              <a
                href={`${windowOrigin}/members/${winner.handle}`}
                styleName="handle"
                target={`${_.includes(windowOrigin, 'www') ? '_self' : '_blank'}`}
              >
                {winner.handle}
              </a>
            </div>
          </div>
          {
            submissionId
            && (
            <div styleName="id">
              ID:
              <span>
                #
                {getId(submissions, winner.placement)}
              </span>
            </div>
            )
          }
        </div>
      </div>

      <div styleName="right">
        <div styleName="prize">
          {prizeText}
        </div>
      </div>
      <div styleName="download-container">
        {
        (!hideDownloadForMMRDM
        && (!winner.submissionDownloadLink || !viewable)
        && (isMM || isRDM) && isLoggedIn) && (
          <button
            onClick={() => {
              // download submission
              const submissionsService = getService(auth.m2mToken);
              submissionsService.downloadSubmission(mmSubmissionId)
                .then((blob) => {
                  const url = window.URL.createObjectURL(new Blob([blob]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `submission-${mmSubmissionId}.zip`);
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode.removeChild(link);
                });
            }}
            type="button"
          >
            <DownloadIcon />
          </button>
        )
        }
        {
          (winner.submissionDownloadLink && viewable)
          && (
          <a
            href={isDesign ? `${config.URL.STUDIO}/?module=DownloadSubmission&sbmid=${submissionId}` : winner.submissionDownloadLink}
            styleName="download"
            target="_blank"
            challenge
            rel="noopener noreferrer"
          >
            <DownloadIcon />
          </a>
          )
        }
        {
          /*
          <div styleName="date">
            <span>Submitted&nbsp;on:</span>&zwnj;
            &zwnj;<span>{moment(winner.submissionDate).format('MMM DD, YYYY HH:mm')}</span>
          </div>
          */
        }
      </div>
    </div>
  );
}

Winner.defaultProps = {
  prizes: [],
};

Winner.propTypes = {
  isDesign: PT.bool.isRequired,
  isMM: PT.bool.isRequired,
  isRDM: PT.bool.isRequired,
  prizes: PT.arrayOf(PT.shape()),
  submissions: PT.arrayOf(PT.object).isRequired,
  viewable: PT.bool.isRequired,
  winner: PT.shape({
    handle: PT.string.isRequired,
    placement: PT.number.isRequired,
    photoURL: PT.any,
    submissionDownloadLink: PT.any,
  }).isRequired,
  isLoggedIn: PT.bool.isRequired,
  auth: PT.shape().isRequired,
};
