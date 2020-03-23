/**
 * Profile Header.  Displays the name, country, potrait and quote for the member.
 */
import React from 'react';
import PT from 'prop-types';
import { getRatingColor } from 'utils/tc';

import UserDefaultIcon from 'assets/images/ico-user-default.svg';

import './styles.scss';

const Profile404 = ({
  handle,
}) => (
  <div styleName="container">
    <div>
      <UserDefaultIcon />
    </div>
    <div styleName="info">
      <h1 style={{ color: getRatingColor(0) }} styleName="handle">
        {handle}
      </h1>
    </div>
  </div>
);

Profile404.defaultProps = {
  handle: '',
};

Profile404.propTypes = {
  handle: PT.string,
};

export default Profile404;
