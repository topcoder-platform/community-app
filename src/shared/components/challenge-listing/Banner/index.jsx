import React, { useState } from 'react';
import { config } from 'topcoder-react-utils';

import BannerCloseIcon from 'assets/images/banner-close.svg';
import BannerInfoIcon from 'assets/images/banner-info.svg';
import './style.scss';

const Banner = () => {
  const [isDisplayed, setIsDisplayed] = useState(true);

  return isDisplayed && (
    <a
      href={`${config.PLATFORM_SITE_URL}/earn/find/challenges`}
      target="_blank"
      rel="noopener noreferrer"
      styleName="banner"
    >
      <div styleName="content">
        <div styleName="banner-info">
          <BannerInfoIcon />
        </div>
        <span>
          Click here if you&apos;d like to visit the new Beta Challenge Listings site
        </span>
      </div>

      <div
        styleName="banner-close"
        onClick={(e) => {
          e.preventDefault();
          setIsDisplayed(false);
        }}
        aria-hidden="true"
        role="button"
      >
        <BannerCloseIcon />
      </div>
    </a>
  );
};

export default Banner;
