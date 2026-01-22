/**
 * Profile Header.  Displays the name, country, potrait and quote for the member.
 */
import React, { useEffect, useState } from 'react';
import PT from 'prop-types';
import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';

const ProfileHeader = ({ info }) => {
  const [imageUrl, setimageUrl] = useState();
  const { handle } = info;

  useEffect(() => {
    let url = '';
    const { photoURL } = info;
    if (isomorphy.isClientSide() && photoURL) {
      url = photoURL;
    }

    setimageUrl(url);
  }, []);

  const loadImageError = () => {
    setimageUrl(null);
  };

  return (
    <div styleName="container">
      <div styleName="curve" />
      <div styleName="header-container">
        <div>
          { imageUrl
            ? <img src={imageUrl} onError={loadImageError} styleName="profile-image" alt="Member Portait" />
            : (
              // eslint-disable-next-line global-require
              <img src={require('assets/images/ico-user-default.svg')} styleName="profile-image" alt="Member Portait" />
            )
}
        </div>

        <div styleName="header-content">
          <div styleName="member-handle">
            {handle}
          </div>
        </div>

      </div>
    </div>
  );
};


ProfileHeader.defaultProps = {
  info: {},
};

ProfileHeader.propTypes = {
  info: PT.shape(),
};

export default ProfileHeader;
