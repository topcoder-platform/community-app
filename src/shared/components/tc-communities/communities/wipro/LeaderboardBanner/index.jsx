import Banner from 'components/tc-communities/Banner';
import React from 'react';

import bannerImage from
  'assets/images/communities/wipro/leaderboard/banner.jpg';

import bannerStyle from './style.scss';

export default function ChallengeListingBanner() {
  return (
    <Banner
      title="&nbsp;&nbsp;Rewards program"
      imageSrc={bannerImage}
      theme={bannerStyle}
    >
      <p>
        Rewards program is intended<br />to celebrate and recognize<br />your
        contribution.
      </p>
    </Banner>
  );
}
