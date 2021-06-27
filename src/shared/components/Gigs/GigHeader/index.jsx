import React from 'react';
import { config, Link } from 'topcoder-react-utils';
import PT from 'prop-types';
import BannerInfoIcon from 'assets/images/banner-info.svg';
import './style.scss';

const GigHeader = ({ appNum }) => (
  <div
    styleName="gig-header"
  >
    <div styleName="content">
      <div styleName="banner-info">
        <BannerInfoIcon />
      </div>
      <span>
        You have {appNum} applied Gigs in the system
      </span>
    </div>

    <div styleName="row-btn">
      <Link styleName="primary-white-md" to={`${config.PLATFORM_SITE_URL}/earn/my-gigs`}>CHECK GIG APPLICATION STATUS</Link>
    </div>
  </div>
);

GigHeader.defaultProps = {
  appNum: 0,
};

GigHeader.propTypes = {
  appNum: PT.number,
};
export default GigHeader;
