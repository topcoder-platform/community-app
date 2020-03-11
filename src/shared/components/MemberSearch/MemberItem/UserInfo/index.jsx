import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import UserAvatar from '../../User/UserAvatar';
import UserBio from '../../User/UserBio';
import UsernameAndDetails from '../../User/UsernameAndDetails';

import './style.scss';

const UserInfo = ({ user, userPlace, withBio }) => {
  let userBio;

  if (withBio && user.description) {
    userBio = <UserBio bio={user.description} />;
  }

  let userPlaceNumber = null;
  if (_.isFinite(userPlace)) {
    userPlaceNumber = <div styleName="list-number">{userPlace + 1}</div>;
  }

  return (
    <div styleName="user-info">
      <div styleName="user-profile">
        {userPlaceNumber}

        <UserAvatar
          showLevel
          rating={user.maxRating && user.maxRating.rating}
          photoURL={user.photoURL}
        />

        <UsernameAndDetails
          username={user.handle}
          country={user.competitionCountryCode}
          numWins={user.wins}
          memberSince={user.createdAt}
        />
      </div>

      {userBio}
    </div>
  );
};

UserInfo.propTypes = {
  user: PropTypes.shape({
    maxRating: PropTypes.shape({
      rating: PropTypes.number,
    }),
    photoURL: PropTypes.string,
    handle: PropTypes.string,
    competitionCountryCode: PropTypes.string,
    wins: PropTypes.number,
    createdAt: PropTypes.number,
    description: PropTypes.string,
  }).isRequired,
  userPlace: PropTypes.number,
  withBio: PropTypes.bool,
};

UserInfo.defaultProps = {
  userPlace: null,
  withBio: false,
};

export default UserInfo;
