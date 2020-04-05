import React from 'react';
import PropTypes from 'prop-types';
import Dotdotdot from 'react-dotdotdot';

import './style.scss';

const UserBio = ({ bio }) => (
  <div styleName="user-bio">
    <Dotdotdot clamp={3}>
      {bio}
    </Dotdotdot>
  </div>
);


UserBio.propTypes = {
  bio: PropTypes.string.isRequired,
};

export default UserBio;
