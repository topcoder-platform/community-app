import { Avatar } from 'topcoder-react-ui-kit';
import config from 'utils/config';
// import moment from 'moment';
import PT from 'prop-types';
import React from 'react';

import Lock from '../../icons/lock.svg';

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
  const submissionId = viewable && getId(submissions, winner.placement);
  const placeStyle = winner.placement < 4 ? `place-${winner.placement}` : '';

  let avatarUrl = winner.photoURL;
  if (avatarUrl) {
    avatarUrl = `${config.CDN.PUBLIC}/avatar/${
      encodeURIComponent(avatarUrl)}?size=65`;
  }

  const prize = winner.placement <= prizes.length
    ? `${prizes[winner.placement - 1].toLocaleString()}` : 'N/A';

  return (
    <div styleName={`winner ${placeStyle}`}>
      {
        <div styleName="thumbnail">
          <div styleName="flag">{winner.placement}</div>
          {
            (viewable && isDesign) ?
              (
                <img
                  styleName="preview"
                  alt=""
                  src={`${config.URL.STUDIO}/studio.jpg` +
                    `?module=DownloadSubmission&sbmid=${submissionId}&sbt=small&sfi=1`}
                />
              ) :
              (
                <div styleName="lock">
                  <Lock styleName="lock-icon" />
                  <div styleName="text">LOCKED</div>
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
            >{winner.handle}</a>
            <div styleName="prize">${prize}</div>
          </div>
        </div>
        {
          submissionId &&
          <div styleName="id">ID: <span>#{getId(submissions, winner.placement)}</span></div>
        }
        {
          (winner.submissionDownloadLink && viewable) &&
          <a
            styleName="download"
            target="_blank"
            href={isDesign ? `${config.URL.STUDIO}/?module=DownloadSubmission&sbmid=${submissionId}` : winner.submissionDownloadLink}
          >Download</a>
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

Winner.propTypes = {
  isDesign: PT.bool.isRequired,
  prizes: PT.arrayOf(PT.number).isRequired,
  submissions: PT.arrayOf(PT.object).isRequired,
  viewable: PT.bool.isRequired,
  winner: PT.shape({
    handle: PT.string.isRequired,
    placement: PT.number.isRequired,
  }).isRequired,
};
