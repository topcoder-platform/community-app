/**
 * Static implementation of Get Started page for Cognitive community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */
/* eslint-disable max-len */

import React from 'react';
import { Link } from 'utils/router';
import Banner from 'components/tc-communities/Banner';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import ImageText from 'components/tc-communities/ImageText';

import bannerStyle from './banner.scss';
import quoteStyle from './quote.scss';
import imageTextStyle from './imageText.scss';
import joinButtonStyle from '../themes/joinButtonBlue.scss';
import style from './style.scss';

export default function GetStarted() {
  return (
    <main>
      <Banner
        title="Welcome to the Topcoder Cognitive Community"
        text="Cognitive computing is the next hot area in software development and for good reason! The mantra of mobile first is now being replaced by AI First and consumer dependency on their smart phone will soon be replaced by a dependency on cognitive computing ranging from voice controls, natural language parsing to AI bots. Developers with this skill set will be in high demand!"
        imageSrc="/community-app-assets/themes/cognitive/getstarted/banner.jpg"
        theme={bannerStyle}
      >
        <ImageText
          title="Dave Messinger"
          text="Topcoder VP of Product Architecture & Global Developer Community Director"
          imageSrc="/community-app-assets/themes/cognitive/getstarted/dave.png"
          theme={quoteStyle}
        />
      </Banner>
      <ImageText
        title="Get Started"
        imageSrc="/community-app-assets/themes/cognitive/getstarted/image1.jpg"
        theme={imageTextStyle}
        link={[
          {
            title: 'developerWorks',
            url: 'https://www.ibm.com/developerworks/learn/cognitive/',
          },
          {
            title: 'Watson',
            url: 'https://www.ibm.com/watson/',
          },
          {
            title: 'IBM Cognitive',
            url: 'https://www.ibm.com/cognitive/',
          },
          {
            title: 'IBM Research',
            url: 'http://research.ibm.com/cognitive-computing/',
          },
          {
            title: 'Join the Cloud community',
            url: 'http://cognitive.topcoder.com/register/',
          },
        ]}
      >
        <JoinCommunity theme={{ link: joinButtonStyle }} label="Sign up now" />
      </ImageText>
      <ImageText
        title="Start Your Cognitive Journey"
        text="Ready to get started with Cognitive? The Topcoder Cognitive Community is free to join, and there are no obligations of any kind. All you need is a passion for technology and learning."
        imageSrc="/community-app-assets/themes/cognitive/getstarted/image2.jpg"
        theme={imageTextStyle}
      >
        <JoinCommunity theme={{ link: joinButtonStyle }} label="Sign up now" />
      </ImageText>
      <ImageText
        title="Topcoder Cognitive Challenge"
        text="Topcoder and IBM Cognitive have partnered to roll out a series of educational challenges that will help you learn everything you need to compete in development challenges for Cognitive technologies. Once you join the Topcoder Cognitive Community we’ll notify you of the latest challenges as they are released."
        imageSrc="/community-app-assets/themes/cognitive/getstarted/image3.jpg"
        theme={imageTextStyle}
      >
        <div className={style.compete}>
          <Link
            to={'challenges/'}
            className={style.competeLink}
          >Compete Now</Link>
        </div>
      </ImageText>
    </main>
  );
}

GetStarted.defaultProps = {
};

GetStarted.propTypes = {
};
