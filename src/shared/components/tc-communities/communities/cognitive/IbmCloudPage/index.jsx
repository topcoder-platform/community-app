import React from 'react';

// import AutoTransition from './AutoTransition';
import Differences from './Differences';
import HeadBanner from './HeadBanner';
import JoinBlock from './JoinBlock';
import NewsSignup from '../NewsSignup';

export default function IbmCloudPage() {
  return (
    <div>
      <HeadBanner />
      <JoinBlock />
      <Differences />

      {/* Hidden by the request from Trevor: the transition process won't start
        * until Feb 12. */}
      {/* <AutoTransition /> */}

      <NewsSignup />
    </div>
  );
}
