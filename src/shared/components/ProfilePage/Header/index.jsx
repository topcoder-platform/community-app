/**
 * Profile Header.  Displays the name, country, potrait and quote for the member.
 */
import React, { useEffect, useState } from 'react';
import PT from 'prop-types';

import { isomorphy } from 'topcoder-react-utils';

// import VerifiedBadge from 'assets/images/profile/verified-badge.svg';
// import InfoIcon from 'assets/images/profile/ico-info.svg';
// import Tooltip from 'components/Tooltip';

import './styles.scss';

const ProfileHeader = ({ info }) => {
  const [imageUrl, setimageUrl] = useState();

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

  // const tooltipContent = (
  //   <div styleName="tooltip-content">verified member</div>
  // );

  const { handle } = info;
  // const isMemberVerified = true;

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

          {/* { */}
          {/*   isMemberVerified && ( */}
          {/*     <div styleName="verified-member"> */}
          {/*       <VerifiedBadge /> */}

          {/*       <span>verified member</span> */}

          {/*       <div styleName="info"> */}
          {/*         <Tooltip */}
          {/*           content={tooltipContent} */}
          {/*           trigger={['hover', 'focus']} */}
          {/*         > */}
          {/*           <InfoIcon /> */}
          {/*         </Tooltip> */}
          {/*       </div> */}
          {/*     </div> */}
          {/*   ) */}
          {/* } */}
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
