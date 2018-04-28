import Banner from 'components/tc-communities/Banner';
import React from 'react';

import bannerImage from
  'assets/images/communities/wipro/challenges/banner.jpg';

import bannerStyle from './style.scss';

export default function ChallengeListingBanner() {
  return (
    <Banner
      title="&nbsp;&nbsp;Amazing platform &nbsp;&nbsp;of&nbsp;design, development &nbsp;&nbsp;and&nbsp;test challenges"
      imageSrc={bannerImage}
      theme={bannerStyle}
    >
      <p>
        Compete and walk away with cash prizes!
      </p>
    </Banner>
  );
}
