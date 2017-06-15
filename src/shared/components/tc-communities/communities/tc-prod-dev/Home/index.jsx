/**
 * Static implementation of Home page for Wipro 2 community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */
/* eslint-disable max-len */

import React from 'react';
import Section from 'components/tc-communities/Section';
import Banner from 'components/tc-communities/Banner';
import ImageText from 'components/tc-communities/ImageText';
import ResourceCard from 'components/tc-communities/ResourceCard';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import NewsSection from 'components/tc-communities/NewsSection';
import PT from 'prop-types';

import GroupStats from 'containers/tc-communities/GroupStats';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';

import IconRocket from '../../../../../../assets/images/tc-communities/rocket.svg';
import IconNetwork from '../../../../../../assets/images/tc-communities/network.svg';
import IconMedal from '../../../../../../assets/images/tc-communities/medal.svg';

import style from './style.scss';

export default function Home(props) {
  return (
    <main>
      <Banner
        title="Topcoder Product Development Community"
        text="This is the place where Topcoder members can come to focus on work that involves building out the Topcoder Platform."
        link={{
          title: 'Compete Now',
          url: 'challenges',
        }}
        imageSrc="/themes/tc-prod-dev/community-hero.jpg"
      />

      <GroupStats />

      <JoinCommunity />

      <Section
        theme={{
          container: style.linksContainer,
        }}
      >
        <div>
          <ImageText
            title="Ramp Up"
            text="Learn about what we're working on, our environments, procedures, etc. If you want to get involved in Topcoder projects, this is a good place to start. We run challenges and tasks constantly, so we're always looking for help."
            link={{
              title: 'Start Learning',
              url: 'learn',
            }}
            imageSrc="/themes/wipro/home/image-text-learn.jpg"
          />
          <ImageText
            title="Get Involved"
            text="Whether you're a copilot, designer, developer, or data scientist...we want you involved. Topcoder is one of the biggest customers of our own platform, so there is never a shortage of interesting things to work on."
            link={{
              title: 'Start Contributing',
              url: 'challenges',
            }}
            imageSrc="/themes/wipro/home/image-text-do.jpg"
          />
        </div>
      </Section>

      <Section
        theme={{
          container: style.resourcesContainer,
        }}
      >
        <ResourceCard
          icon={IconNetwork}
          title="Learn about our platform"
          text="There are many aspects to our platform...something for everyone."
          link={{
            title: 'Browse resources',
            url: 'learn',
          }}
        />
        <ResourceCard
          icon={IconMedal}
          title="What's in it for me?"
          text="Topcoder rewards participants with cash. The more deliverables you produce, the more you can make."
          link={{
            title: 'Learn about rewards',
            url: 'leaderboard',
          }}
        />
        <ResourceCard
          icon={IconRocket}
          title="Participate in many ways"
          text="We're always running challenges and tasks.  Check back every day to see what's new."
          link={{
            title: 'Browse challenges',
            url: 'challenges',
          }}
        />
      </Section>

      <NewsSection news={props.news} />

      <NewsletterSignup
        title="Sign up for Topcoder Product Development Updates"
        text="Don’t miss out opportunities to work on the Topcoder Platform!"
        imageSrc="/themes/wipro/subscribe-bg.jpg"
      />

    </main>
  );
}

Home.defaultProps = {
  news: [],
};

Home.propTypes = {
  news: PT.arrayOf(PT.shape()),
};

