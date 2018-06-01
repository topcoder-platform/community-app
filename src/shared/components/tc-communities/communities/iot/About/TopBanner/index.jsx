/**
 * Top Banner component of About page IoT community
 */
/* eslint-disable max-len */
import React from 'react';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import './styles.scss';

const TopBanner = () => (
  <div styleName="wrapper">
    <div styleName="banner">
      <div styleName="container">
        <div styleName="inner-container">
          <h2 styleName="title">The World&#39;s First Industrial Internet Platform</h2>
          <div styleName="text">
            <p>By connecting machines, intelligence, and people, Predix is reshaping the companies that shape our world. From individual data sensor to analytics in the boardroom, Predix is the Industrial Internet of Things platform for driving operational and business outcomes that matter. Are you ready to become part of the digital-industrial revolution?</p>
          </div>
          <div styleName="buttons">
            <PrimaryButton to="https://www.predix.io/" openNewTab>Learn More</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TopBanner;
