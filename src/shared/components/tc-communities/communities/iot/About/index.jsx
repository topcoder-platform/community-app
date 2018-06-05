/**
 * About static page of IoT community
 */
/* eslint-disable max-len */
import React from 'react';
import PT from 'prop-types';

import predixLogoSrc from 'assets/themes/iot/about/predix-logo.png';
import geLogoSrc from 'assets/themes/iot/about/ge-digital-logo.png';
import geniuslinkLogoSrc from 'assets/themes/iot/about/geniuslink-logo.png';

import Section from '../../../Section';
import JoinSection from '../JoinSection';
import TopBanner from './TopBanner';

import styles from './styles.scss';

export default function About({
  baseUrl,
}) {
  return (
    <main styleName="main">
      <TopBanner />
      <Section
        theme={{
          container: styles.quoteContainer,
        }}
      >
        <div styleName="logos">
          <a href="http://predix.io/" rel="noopener noreferrer" target="_blank">
            <img src={predixLogoSrc} alt="Predix logo" />
          </a>
          <a href="http://predix.io/" rel="noopener noreferrer" target="_blank">
            <img src={geLogoSrc} alt="GE Digital logo" />
          </a>
          <a href="http://predix.io/" rel="noopener noreferrer" target="_blank">
            <img src={geniuslinkLogoSrc} alt="GENIUSLINK logo" />
          </a>
        </div>
        <div styleName="quote">
          <h1>“Industrial challenges require the global real-time big data analytics provided by the GE Predix platform.”</h1>
          <h3>Mark Wright</h3>
          <p>President of digital commerce solutions, Pitney Bowes</p>
        </div>
      </Section>
      <JoinSection
        baseUrl={baseUrl}
      />
    </main>
  );
}

About.propTypes = {
  baseUrl: PT.string.isRequired,
};
