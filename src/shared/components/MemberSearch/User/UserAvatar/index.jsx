import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import { Link } from 'react-router-dom';
import { getInitials } from '../../helpers';

const UserAvatar = ({ photoURL, handle }) => (
  <Link to={`/members/${handle}`}>
    {
        photoURL ? (
          <div styleName="user-avatar-r" style={{ backgroundImage: `url(${photoURL})` }} />
        ) : (
          <div styleName="user-avatar-r user-avatar-default"><span>{getInitials(handle)}</span></div>
        )
      }
  </Link>
);

UserAvatar.defaultProps = {
  photoURL: '',
  handle: '',
};

UserAvatar.propTypes = {
  photoURL: PropTypes.string,
  handle: PropTypes.string,
};


export default UserAvatar;
