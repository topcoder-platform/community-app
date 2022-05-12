import { Avatar } from 'topcoder-react-ui-kit';
import PT from 'prop-types';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { config } from 'topcoder-react-utils';
import { connect } from 'react-redux';
import { actions } from 'topcoder-react-lib';

import Lock from '../../icons/lock.svg';

import style from './style.scss';

function getId(submissions, placement) {
  return submissions.find(s => s.placement === placement).submissionId;
}

function Winner({
  loadInfo,
  isDesign,
  last,
  prizes,
  submissions,
  viewable,
  winner,
  info,
}) {
  const [imageUrl, setImageUrl] = useState(winner.photoURL);
  const [windowOrigin, setWindowOrigin] = useState();
  useEffect(() => {
    setWindowOrigin(window.origin);
    loadInfo(winner.handle);
  }, []);

  useEffect(() => {
    if (info && info.photoURL) {
      setImageUrl(info.photoURL);
    }
  }, [info]);

  const submissionId = viewable && getId(submissions, winner.placement);

  let placeStyle = winner.placement < 4 ? `place-${winner.placement}` : '';
  if (last) placeStyle += ' last';

  let avatarUrl = winner.photoURL;
  if (avatarUrl) {
    avatarUrl = `${config.CDN.PUBLIC}/avatar/${
      encodeURIComponent(avatarUrl)}?size=65`;
  }

  let prize = 'N/A';
  const prizeIndex = parseInt(winner.placement, 10) - 1;
  if (prizes[prizeIndex]) prize = prizes[prizeIndex].value;

  // NOTE: borrow this strange func from outside
  function getOrdinal(num) {
    const ordinals = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0];
  }

  return (
    <div styleName="winner-row">
      <div styleName="rank-avatar-handle-left">
        <div id={`rank${winner.placement}`} styleName="prize-card">
          <p styleName="prize-rank">
            {winner.placement}
            <span styleName="rank-ordinal">
              {getOrdinal(winner.placement)}
            </span>
          </p>
        </div>

        {
          imageUrl
            ? <img src={imageUrl} onError={() => setImageUrl(null)} styleName="user-avatar" alt="User Avatar" />
            : <div styleName="default-user-avatar" />
        }

        <a
          href={`${windowOrigin}/members/${winner.handle}`}
          styleName="handle"
          target={`${_.includes(windowOrigin, 'www') ? '_self' : '_blank'}`}
        >
          {winner.handle}
        </a>
      </div>

      <div styleName="prize-right">
        $
        {prize}
      </div>
    </div>
  );

  // NOTE: old version reserved for reference
  /* eslint-disable no-unreachable */
  return (
    <div styleName={`winner ${placeStyle}`}>
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
  prizes: [],
  info: null,
};

Winner.propTypes = {
  isDesign: PT.bool.isRequired,
  last: PT.bool.isRequired,
  prizes: PT.arrayOf(PT.object),
  submissions: PT.arrayOf(PT.object).isRequired,
  viewable: PT.bool.isRequired,
  winner: PT.shape({
    handle: PT.string.isRequired,
    placement: PT.string.isRequired,
    photoURL: PT.any,
    submissionDownloadLink: PT.any,
  }).isRequired,
  info: PT.shape(),
  loadInfo: PT.func.isRequired,
};

function mapStateToProps(state) {
  return {
    info: state.profile.info,
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.profile;
  return {
    loadInfo: (handle) => {
      dispatch(a.getInfoInit(handle));
      dispatch(a.getInfoDone(handle));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Winner);
