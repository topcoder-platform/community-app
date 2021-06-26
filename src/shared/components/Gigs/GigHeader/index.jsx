import React from 'react';
import { config, Link } from 'topcoder-react-utils';
import BannerInfoIcon from 'assets/images/banner-info.svg';
import './style.scss';

const GigHeader = () => {
  return (
    <div
      styleName="gig-header"
    >
      <div styleName="content">
        <div styleName="banner-info">
          <BannerInfoIcon />
        </div>
        <span>
          You have 3 applied Gigs in the system
        </span>
      </div>

      <div styleName="row-btn">
        <Link styleName="primary-white-md" to={`${config.PLATFORM_SITE_URL}/earn/my-gigs`}>CHECK GIG APPLICATION STATUS</Link>
      </div>
    </div>
  );
};

export default GigHeader;
