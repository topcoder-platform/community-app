/**
 * Head banner for challenge listing page in Blockchain community.
 */

import Banner from 'components/tc-communities/Banner';
import React from 'react';
import style from './style.scss';

export default function TopBanner() {
  return (
    <Banner
      title="Challenges"
      text="Browse our available challenges and compete."
      theme={{
        container: style.bannerContainer,
        content: style.bannerContent,
        contentInner: style.bannerContentInner,
      }}
      imageSrc="/themes/blockchain/challenges/banner.jpg"
    />
  );
}
