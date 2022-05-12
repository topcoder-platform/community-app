import { Avatar } from 'topcoder-react-ui-kit';
import PT from 'prop-types';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { config } from 'topcoder-react-utils';
import { formatOrdinals, numberWithCommas } from 'utils/challenge-detail/helper';

import style from './style.scss';

function getId(submissions, placement) {
  return submissions.find(s => s.placement === placement).submissionId;
}

export default function Winner({
  isDesign,
  prizes,
  submissions,
  viewable,
  winner,
}) {
  const [windowOrigin, setWindowOrigin] = useState();
  useEffect(() => {
    setWindowOrigin(window.origin);
  }, []);

  const submissionId = viewable && getId(submissions, winner.placement);

  let avatarUrl = winner.photoURL;
  if (avatarUrl) {
    avatarUrl = `${config.CDN.PUBLIC}/avatar/${
      encodeURIComponent(avatarUrl)}?size=65`;
  }

  let prize = 'N/A';
  const prizeIndex = parseInt(winner.placement, 10) - 1;
  if (prizes[prizeIndex]) prize = prizes[prizeIndex].value;

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
              Download
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

      <div styleName="right">
        <div styleName="prize">
          $
          {numberWithCommas(prize)}
        </div>
      </div>
    </div>
  );
}

Winner.defaultProps = {
  prizes: [],
};

Winner.propTypes = {
  isDesign: PT.bool.isRequired,
  prizes: PT.arrayOf(PT.number),
  submissions: PT.arrayOf(PT.object).isRequired,
  viewable: PT.bool.isRequired,
  winner: PT.shape({
    handle: PT.string.isRequired,
    placement: PT.number.isRequired,
    photoURL: PT.any,
    submissionDownloadLink: PT.any,
  }).isRequired,
};
