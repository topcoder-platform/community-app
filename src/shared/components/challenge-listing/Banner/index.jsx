import React, { useState } from 'react';
import { config } from 'topcoder-react-utils';

import BannerCloseIcon from 'assets/images/banner-close.svg';
import BannerInfoIcon from 'assets/images/banner-info.svg';
import './style.scss';

const Banner = () => {
  const [isDisplayed, setIsDisplayed] = useState(true);

  return isDisplayed && (
    <div styleName="banner">
      <div styleName="content">
        <div styleName="banner-info">
          <BannerInfoIcon />
        </div>
        <span>Click <a href={`${config.PLATFORM_SITE_URL}/earn/find/challenges`} target="_blank" rel="noopener noreferrer">here</a> if you&quot;d like to visit the new BETA Challenge Listings site.</span>
      </div>

      <div
        styleName="banner-close"
        onClick={() => setIsDisplayed(false)}
        aria-hidden="true"
        role="button"
      >
        <BannerCloseIcon />
      </div>
    </div>
  );
};

export default Banner;
