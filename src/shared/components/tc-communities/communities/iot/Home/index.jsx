/**
 * Home static page of IoT community
 */
/* eslint-disable max-len */

import React from 'react';
import PT from 'prop-types';

import PredixLogoSrc from 'assets/themes/iot/home/predix.png';

import YouTubeVideo from 'components/YouTubeVideo';
import Section from '../../../Section';
import Quote from '../../../Quote';
import JoinSection from '../JoinSection';
import TopBanner from './TopBanner';

import styles from './styles.scss';

export default function Home({
  baseUrl,
}) {
  return (
    <main styleName="main">
      <TopBanner
        baseUrl={baseUrl}
      />
      <Section
        theme={{
          container: styles.welcomeContainer,
        }}
      >
        <div>
          <h2>Welcome to the Topcoder Community for Predix</h2>
          <Quote
            authorDescription="GE Digital, Predix Developer Relations"
            authorName="Lothar Schubert"
            authorPhotoURL="http://predix.topcoder.com/wp-content/uploads/sites/7/2016/10/lothar.png"
          >
            “Predix is GE’s platform for the Industrial Internet of Things (IIoT). I’d like to invite you to join over 20,000 developers and data scientists around the world, working on the forefront of the digital-industrial revolution.”
          </Quote>
        </div>
      </Section>
      <Section
        theme={{
          container: styles.predixCloudContainer,
        }}
      >
        <div>
          <img src={PredixLogoSrc} alt="Predix" />
          <h1>Your cloud platform for the Industrial Internet</h1>
          <h3>Built on Cloud Foundry, Predix is optimized for secure connectivity<br /> and analytics at scale – in the Cloud and on the Edge</h3>
        </div>
      </Section>
      <YouTubeVideo
        src="https://www.youtube.com/embed/HU2xr_wjR3s"
        rel={false}
        showinfo={false}
        videoId="HU2xr_wjR3s"
        thumb={<div styleName="videoPlayButton" />}
      />
      <Section
        theme={{
          container: styles.singleQuoteContainer,
        }}
      >
        <Quote
          authorDescription="Software & Services GM, GE Digital."
          theme={{
            text: styles.singleQuoteText,
          }}
        >
          “We can’t do everything ourselves, nor should we. There are things that we need to be unapologetically awesome at, and there are areas where we need to partner, <br />
          GE wants to be <strong>unapologetically awesome</strong> at data and analytics”<br />
          says Ashley Haynes-Gaspar,
        </Quote>
      </Section>
      <JoinSection
        baseUrl={baseUrl}
      />
    </main>
  );
}

Home.propTypes = {
  baseUrl: PT.string.isRequired,
};
