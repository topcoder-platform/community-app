/**
 * Resources static page of IoT community
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

export default function Resources({
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
          Resources
        </div>
      </Section>
      <JoinSection
        baseUrl={baseUrl}
      />
    </main>
  );
}

Resources.propTypes = {
  baseUrl: PT.string.isRequired,
};
