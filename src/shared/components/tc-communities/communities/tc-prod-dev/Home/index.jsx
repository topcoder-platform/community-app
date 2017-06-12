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
import IconStat from 'components/tc-communities/IconStat';
import ImageText from 'components/tc-communities/ImageText';
import ResourceCard from 'components/tc-communities/ResourceCard';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import NewsSection from 'components/tc-communities/NewsSection';
import PT from 'prop-types';

import IconSuitcase from '../../../../../../assets/images/tc-communities/suitcase.svg';
import IconRocket from '../../../../../../assets/images/tc-communities/rocket.svg';
import IconMember from '../../../../../../assets/images/tc-communities/member.svg';
import IconDollar from '../../../../../../assets/images/tc-communities/dollar.svg';
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
        imageSrc="/themes/wipro/home/banner.jpg"
      />

      <Section
        theme={{
          container: style.statsContainer,
          content: style.statsContent,
        }}
      >
        <IconStat icon={IconSuitcase} number="NA" label="Projects" />
        <IconStat icon={IconRocket} number="NA" label="Challenges" />
        <IconStat icon={IconMember} number="NA" label="Members" />
        <IconStat icon={IconDollar} number="$NA" label="Prizes" />
      </Section>

      <Section
        theme={{
          container: style.linksContainer,
        }}
      >
        <div>
          <ImageText
            title="Ramp Up"
            text="Learn about what we're working on, our environments, procedures, etc."
            link={{
              title: 'Start Learning',
              url: 'learn',
            }}
            imageSrc="/themes/wipro/home/image-text-learn.jpg"
          />
          <ImageText
            title="Get Involved"
            text="Whether you're a copilot, designer, developer, or data scientist...we want you involved. "
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
          text="Pellentesque non dignissim neque. Nunc  vel rhoncus nibh, ut tincidunt turpis. Integer ac enim pellentesque, adipiscing metus id, pharetra odio."
          link={{
            title: 'Browse resources',
            url: 'learn',
          }}
        />
        <ResourceCard
          icon={IconMedal}
          title="What's in it for me?"
          text="Donec bibendum nunc sit amet tortor scelerisque luctus et sit amet mauris. Suspendisse felis sem, condimentum ullamcorper est sit amet, molestie"
          link={{
            title: 'Learn about badges',
            url: 'leaderboard',
          }}
        />
        <ResourceCard
          icon={IconRocket}
          title="Participate in many ways"
          text="Suspendisse felis sem, condimentum ullamcorper est sit amet, molestie mollis nulla. Etiam lorem orci, consequat ac magna quis, facilisis "
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

