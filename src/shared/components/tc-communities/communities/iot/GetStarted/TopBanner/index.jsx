/**
 * Top Banner component of About page IoT community
 */
/* eslint-disable max-len */
import React from 'react';

import './styles.scss';

const TopBanner = () => (
  <div styleName="wrapper">
    <div styleName="banner">
      <div styleName="container">
        <div styleName="inner-container">
          <h1 styleName="title">Welcome to Topcoder Community for Predix</h1>
          <div styleName="text">
            <p>The industrial Internet of things is arguably the biggest growth center for the next 20 years and will affect almost all systems that produce goods worldwide. Industry leaders are predicting IIoT will add 14.2 trillion dollars to the global economy in 2030 and Predix is poised to be the leading platform. As a Topcoder Predix community member, you will have the opportunity to directly participate in the next industrial revolution being played out over the next 25 years.</p>
            <p>Billions of devices across industries will be coming online every year for the foreseeable future. Having a consistent platform such as Predix to provide stability, scale, and consistency will be key to onboarding and operating these devices. Combining this developer friendly platform with Topcoder&#39;s over 1 million developers will provide the scale and quality to realize the potential of IIoT.</p>
          </div>
          <div>
            <h3 styleName="authorName">Dave Messenger</h3>
            <p styleName="authorDescription">
              Topcoder VP of Product Architecture &amp;<br />
              Global Developer Community Director
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TopBanner;
