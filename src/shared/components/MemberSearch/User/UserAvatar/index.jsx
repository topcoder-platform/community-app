import React from 'react';
import PropTypes from 'prop-types';
import LevelDesignatorIcon from '../../icons/LevelDesignatorIcon';
import { memberLevelByRating } from '../../helpers';

import './style.scss';

const UserAvatar = ({ showLevel, rating, photoURL }) => {
  let levelIcon;

  if (showLevel) {
    levelIcon = (
      <span styleName="user-rank">
        <LevelDesignatorIcon level={memberLevelByRating(rating)} height="17px" width="17px" />
      </span>
    );
  }

  /* eslint-disable global-require */
  let backgroundImageUrl = `url(${require('./default-avatar.svg')})`;

  if (photoURL) {
    backgroundImageUrl = `url(${photoURL}), ${backgroundImageUrl}`;
  }

  // Delete -r when taking member search back out of the angular app
  // Renamed to -r to avoid naming collisions
  return (
    <div styleName="user-avatar-r" style={{ backgroundImage: backgroundImageUrl }}>
      {levelIcon}
    </div>
  );
};


UserAvatar.propTypes = {
  showLevel: PropTypes.bool,
  rating: PropTypes.number.isRequired,
  photoURL: PropTypes.string,
};

UserAvatar.defaultProps = {
  showLevel: '',
  photoURL: '',
};

export default UserAvatar;
