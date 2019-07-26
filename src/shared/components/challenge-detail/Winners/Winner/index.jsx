import { Avatar } from 'topcoder-react-ui-kit';
import PT from 'prop-types';
import React from 'react';
import { config } from 'topcoder-react-utils';

import Lock from '../../icons/lock.svg';

import style from './style.scss';

function getId(submissions, placement) {
  return submissions.find(s => s.placement === placement).submissionId;
}

export default function Winner({
  isDesign,
  last,
  pointPrizes,
  prizes,
  submissions,
  viewable,
  winner,
}) {
  const submissionId = viewable && getId(submissions, winner.placement);

  let placeStyle = winner.placement < 4 ? `place-${winner.placement}` : '';
  if (last) placeStyle += ' last';

  let avatarUrl = winner.photoURL;
  if (avatarUrl) {
    avatarUrl = `${config.CDN.PUBLIC}/avatar/${
      encodeURIComponent(avatarUrl)}?size=65`;
  }

  const pair = [];
  const prizeIndex = winner.placement - 1;
  if (prizes[prizeIndex]) pair.push(prizes[prizeIndex].toLocaleString());
  if (pointPrizes[prizeIndex]) pair.push(`${pointPrizes[prizeIndex]}pts`);

  const prize = pair.join(' + ') || 'N/A';

  return (
    <div styleName={`winner ${placeStyle}`}>
      {
        <div styleName="thumbnail">
          <div styleName="flag">
            {winner.placement}
          </div>
          {
            (viewable && isDesign)
              ? (
                <img
                  styleName="preview"
                  alt=""
                  src={`${config.URL.STUDIO}/studio.jpg`
                    + `?module=DownloadSubmission&sbmid=${submissionId}&sbt=small&sfi=1`}
                />
              )
              : (
                <div styleName="lock">
                  <Lock styleName="lock-icon" />
                  <div styleName="text">
LOCKED
                  </div>
                </div>
              )
          }
        </div>
      }
      <div styleName="info">
        <div styleName="avatar-prize">
          <Avatar
            theme={{ avatar: style.avatar }}
            url={avatarUrl}
          />
          <div>
            <a
              href={`${config.URL.BASE}/members/${winner.handle}`}
              styleName="handle"
            >
              {winner.handle}
            </a>
            <div styleName="prize">
$
              {prize}
            </div>
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
  );
}

Winner.defaultProps = {
  pointPrizes: [],
  prizes: [],
};

Winner.propTypes = {
  isDesign: PT.bool.isRequired,
  last: PT.bool.isRequired,
  pointPrizes: PT.arrayOf(PT.number),
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
