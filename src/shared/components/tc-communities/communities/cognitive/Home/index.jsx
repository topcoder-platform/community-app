/**
 * Static implementation of Home page for Cognitive community
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

import QuickLinks from './QuickLinks';

import primaryBannerStyle from './primaryBanner.scss';
import secondaryBannerStyle from './secondaryBanner.scss';

export default function Home() {
  return (
    <main>
      <Banner
        title="Topcoder Cognitive Community"
        text="Learn about Cognitive technologies and get hands on experience as a member of the Topcoder Cognitive Community."
        imageSrc="/community-app-assets/themes/cognitive/home/banner.jpg"
        theme={primaryBannerStyle}
      ><JoinCommunity theme={{ link: primaryBannerStyle.link }} label="Sign up now" /></Banner>
      <Banner
        title="Compete on Cognitive challenges for a chance to win a trip to the Topcoder Open"
        text=""
        link={{
          title: 'Learn More',
          url: 'learn',
        }}
        theme={secondaryBannerStyle}
        imageSrc="/community-app-assets/themes/cognitive/home/learn-more.jpg"
      />
      <QuickLinks
        title="Are you ready to learn?"
        buttonText="Sign up now"
        buttonUrl="register"
        education={[
          {
            text: 'Sign up for a Free Cloud Trial',
            url: 'https://developer.ibm.com/sso/bmregistration?ca=dw-_-cognitive-_-TPC2017-_-community',
          },
          {
            text: 'Explore IBM developerWorks',
            url: 'https://www.ibm.com/developerworks/learn/cognitive/',
          },
          {
            text: 'Take part in a developerWorks Event',
            url: 'https://developer.ibm.com/events/',
          },
        ]}
        challenges={[
          {
            name: '2017 Humblefool Charity Hackathon',
            id: 30059771,
          },
          {
            name: 'IBM Cognitive – Image Recognition Training with PowerAI Notebooks',
            id: 30058628,
          },
        ]}
      />
      <NewsletterSignup
        title="Sign up for our newsletter"
        text="Don’t miss out on the latest Topcoder Cognitive challenges and information!"
        imageSrc="/community-app-assets/themes/cognitive/home/newsletter.jpg"
      />
    </main>
  );
}

Home.defaultProps = {
  news: [],
};

Home.propTypes = {
  // news: PT.arrayOf(PT.shape()),
  // resetChallengeListing: PT.func.isRequired,
};
