/**
 * Profile Header.  Displays the name, country, potrait and quote for the member.
 */
import React, { useEffect, useState } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

import { actions } from 'topcoder-react-lib';
import { isomorphy } from 'topcoder-react-utils';

import VerifiedBadge from 'assets/images/profile/verified-badge.svg';
import InfoIcon from 'assets/images/profile/ico-info.svg';
import Tooltip from 'components/Tooltip';

import './styles.scss';

const verifiedBadgeLookerId = '3322';

const ProfileHeader = ({ getLookerDone, lookerInfo, info }) => {
  const [imageUrl, setimageUrl] = useState();
  const [isMemberVerified, setIsMemberVerified] = useState(false);
  const { handle } = info;

  useEffect(() => {
    let url = '';
    const { photoURL } = info;
    if (isomorphy.isClientSide() && photoURL) {
      url = photoURL;
    }

    setimageUrl(url);
  }, []);

  useEffect(() => {
    if (!lookerInfo || lookerInfo.error) {
      getLookerDone(verifiedBadgeLookerId);
    }
  }, []);

  useEffect(() => {
    if (!lookerInfo || lookerInfo.error) {
      return;
    }
    const { lookerData } = lookerInfo;
    const currentUserData = lookerData.find(x => x['user.handle'] === handle);
    setIsMemberVerified(currentUserData && currentUserData['member_verification.status'] === 'Verified');
  }, [lookerInfo]);

  const loadImageError = () => {
    setimageUrl(null);
  };

  const tooltipContent = (
    <div styleName="tooltip-content">This member is compliant with Topcoder policies<br /> and is a trusted member of the Topcoder community.</div>
  );


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

          {isMemberVerified && (
            <div styleName="verified-member">
              <VerifiedBadge />

              <span>verified member</span>

              <div styleName="info">
                <Tooltip
                  content={tooltipContent}
                  trigger={['hover', 'focus']}
                >
                  <InfoIcon />
                </Tooltip>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};


ProfileHeader.defaultProps = {
  info: {},
};

function mapStateToProps(state) {
  const {
    looker: {
      dataSet,
    },
  } = state;
  return {
    lookerInfo: dataSet[verifiedBadgeLookerId],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getLookerDone: (lookerId) => {
      dispatch(actions.looker.getLookerDone(lookerId));
    },
  };
}

ProfileHeader.propTypes = {
  info: PT.shape(),
  lookerInfo: PT.shape().isRequired,
  getLookerDone: PT.func.isRequired,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileHeader);

export default Container;
