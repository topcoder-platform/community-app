/**
 * Profile Header.  Displays the name, country, potrait and quote for the member.
 */
import React from 'react';
import PT from 'prop-types';
import { noop, get } from 'lodash';
import moment from 'moment';

import { getRatingLevel } from 'utils/tc';
import { config, isomorphy } from 'topcoder-react-utils';

import CopilotIcon from 'assets/images/profile/ico-track-copilot.svg';
import DataScienceIcon from 'assets/images/profile/ico-track-data.svg';
import DesignIcon from 'assets/images/profile/ico-track-design.svg';
import DevelopIcon from 'assets/images/profile/ico-track-develop.svg';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images', false, /svg/);
}

const TRACK_LABELS = {
  COPILOT: 'COPILOT',
  DATA_SCIENCE: 'DATA SCIENTIST',
  DESIGN: 'DESIGNER',
  DEVELOP: 'DEVELOPER',
};

const ProfileHeader = ({
  copilot,
  country,
  info,
  onShowBadges,
  showBadgesButton,
  wins,
}) => {
  const defaultProfilePicture = assets('./ico-user-default.svg');

  const { photoURL = defaultProfilePicture } = info;

  const onProfileImageError = (e) => {
    e.target.src = defaultProfilePicture;
  };

  return (
    <div styleName="container">
      <div>
        <img
          src={photoURL}
          onError={onProfileImageError}
          styleName="profile-circle"
          alt="Member Portait"
        />
      </div>
      <div styleName="info">
        <h1 styleName={`handle level-${getRatingLevel(get(info, 'maxRating.rating', 0))}`}>
          {info.handle}
        </h1>
        <h3 styleName="location-challenges">
          {country}
          {Boolean(wins) && (
            <span>
              {' '}
              |
              {' '}
              {wins}
              {' '}
              Wins
            </span>
          )}
        </h3>
        <h3 styleName="tenure">
          Member Since
          {' '}
          {moment(info.createdAt).format('MMMM, YYYY')}
        </h3>
      </div>
      {
        info.tracks && info.tracks.length > 0
        && (
          <div styleName="tracks-links">
            <div styleName="tracks">
              {
                [...info.tracks, ...(copilot ? ['COPILOT'] : [])].map(track => (
                  <a href={`#${track}`} key={track} styleName="track">
                    {track === 'COPILOT' && <CopilotIcon styleName="track-icon" />}
                    {track === 'DATA_SCIENCE' && <DataScienceIcon styleName="track-icon" />}
                    {track === 'DESIGN' && <DesignIcon styleName="track-icon" />}
                    {track === 'DEVELOP' && <DevelopIcon styleName="track-icon" />}
                    <div styleName="text">
                      {TRACK_LABELS[track]}
                    </div>
                  </a>
                ))
              }
            </div>
          </div>
        )
      }
      {info.description && (
        <p styleName="description">
          {info.description}
        </p>
      )}
      <div styleName="links">
        {
          showBadgesButton ? (
            <a
              onClick={() => onShowBadges()}
              onKeyPress={() => onShowBadges()}
              role="link"
              styleName="link badge-link"
              tabIndex="0"
            >
              Badges
            </a>
          ) : null
        }
        <a href={`${config.URL.FORUMS}/?module=History&userID=${info.userId}`} styleName="link">
          Forum Posts
        </a>
      </div>
    </div>
  );
};

ProfileHeader.defaultProps = {
  copilot: false,
  country: '',
  info: {},
  onShowBadges: noop,
  showBadgesButton: false,
  wins: 0,
};

ProfileHeader.propTypes = {
  copilot: PT.bool,
  country: PT.string,
  info: PT.shape(),
  onShowBadges: PT.func,
  showBadgesButton: PT.bool,
  wins: PT.number,
};

export default ProfileHeader;
