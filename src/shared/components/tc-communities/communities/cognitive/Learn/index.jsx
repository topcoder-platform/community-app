/**
 * Static implementation of Learn page for Cognitive community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */
/* eslint-disable max-len */

import React from 'react';
import Banner from 'components/tc-communities/Banner';
import Section from 'components/tc-communities/Section';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';

import bannerStyle from './banner.scss';

import style from './style.scss';

export default function Learn() {
  return (
    <main>
      <Banner
        title="Learning Cognitive on Topcoder"
        text="Data, in all forms, is an exponentially expanding resource that remains largely untapped. The data explosion is outstripping the human capacity to understand hidden meanings and gain useful insights. That’s where Cognitive comes in."
        imageSrc="/community-app-assets/themes/cognitive/learn/banner.jpg"
        theme={bannerStyle}
      ><JoinCommunity theme={{ link: bannerStyle.link }} label="Sign up now" /></Banner>
      <Section
        theme={{
          content: style.logoContent,
          container: style.logoContainer,
        }}
      >
        <img src="/community-app-assets/themes/cognitive/learn/logo.png" alt="IBM Logo" className={style.logo} />
      </Section>
      <Section
        theme={{
          content: style.introContent,
          container: style.introContainer,
          title: style.introTitle,
        }}
        title="Outthink your biggest challenges with IBM Watson and IBM Cloud."
      >
        <p>
        With the ability to understand, reason, learn, and interact, IBM Watson can help you transform your apps and business. Combined with the IBM cloud platform you’ll have the ability to solve real problems and drive business value with applications, infrastructure, and services.
        </p>
        <p>
        As a developer, you have a lot of information at your fingertips. Allow IBM developerWorks to help you sort through it! Visit <a href="http://www.ibm.com/developerworks/learn/cognitive" target="_blank" rel="noopener noreferrer">www.ibm.com/developerworks/learn/cognitive</a> for tutorials, training, courses, tools, and code to help you create apps that accelerate, enhance, and scale the human experience.
        </p>
        <p>
        Staying current is hard work. The developerWorks editors can make it a little easier. Each month, we bundle up the best technical info on Cognitive Computing and deliver it to your inbox. <a href="https://www.pages03.net/ibmdeveloperworks/developerWorks-CognitiveComputingNewsletterSubscriptionPage/" target="_blank" rel="noopener noreferrer">Subscribe today.</a>
        </p>
        <p>
        We would like to thank IBM for sponsoring the Topcoder Cognitive Community. All of this wouldn’t be possible without the awesome support of the Watson, developerWorks and Cloud teams.
        </p>
      </Section>
      <Section
        theme={{
          content: style.videoContent,
          container: style.videoContainer,
          title: style.videoTitle,
        }}
        title="Outthink your biggest challenges with IBM Watson and IBM Cloud."
      >
        <iframe width="1280" height="720" src="https://www.youtube.com/embed/eJ9ed63qFBE" frameBorder="0" gesture="media" allowFullscreen title="Youtube Video" />
      </Section>
    </main>
  );
}

Learn.defaultProps = {
};

Learn.propTypes = {
};
