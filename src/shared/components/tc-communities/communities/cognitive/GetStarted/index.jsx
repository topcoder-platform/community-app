/**
 * Static implementation of Get Started page for Cognitive community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */
/* eslint-disable max-len */

import React from 'react';
// import PT from 'prop-types';
import Banner from 'components/tc-communities/Banner';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';

import bannerStyle from './banner.scss';
import secondaryBannerStyle from './secondaryBanner.scss';

import style from './style';

export default function GetStarted() {
  return (
    <main>
      <Banner
        title="Topcoder Cognitive Community"
        text="Learn about Cognitive technologies and get hands on experience as a member of the Topcoder Cognitive Community."
        imageSrc="/community-app-assets/themes/cognitive/home/banner.jpg"
        theme={bannerStyle}
      />

    </main>
  );
}

GetStarted.defaultProps = {
};

GetStarted.propTypes = {
};
