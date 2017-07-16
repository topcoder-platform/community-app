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

import CommunityStats from 'containers/tc-communities/CommunityStats';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';

import IconRocket from '../../../../../../assets/images/tc-communities/rocket.svg';
import IconNetwork from '../../../../../../assets/images/tc-communities/network.svg';
import IconMedal from '../../../../../../assets/images/tc-communities/medal.svg';

import style from './style.scss';

export default function Home(props) {
  return (
    <main>
      <Banner
        title="Get work done faster with Topcoder TaskForce"
        text="Time. It’s our most precious resource. You have projects and work where you need to go faster, we have amazing design and development talent, ready to work right now. Let’s get it done."
        link={[{
          title: 'Why Topcoder TaskForce',
          url: 'challenges',
        }, {
          title: 'Create a Task Right Now',
          url: '.',
        }]}
        imageSrc="/themes/wipro/home/banner.jpg"
        theme={{
          content: style.BannerContent,
          link: style.BannerLink,
          linkWrap: style.BannerLinkWrapper,
        }}
      />

      <CommunityStats />

      <JoinCommunity />

      <Section
        theme={{
          container: style.linksContainer,
        }}
      >
        <div>
          <ImageText
            title="Improve Your Skills"
            text="Our continuously evolving structured learning paths, constantly abreast of the latest, tailored for employees to deepen your knowledge, infuses important software capabilities that are industry specific and help you get the skills you need to succeed."
            link={{
              title: 'Start Learning',
              url: 'learn',
            }}
            imageSrc="/themes/wipro/home/image-text-learn.jpg"
          />
          <ImageText
            title="Get Involved"
            text="Rewards program is intended to celebrate and recognize your contribution. Rewards for project contributions are given using ‘Reward Points’. Points earned translate into badges. Quarterly rewards are given away to the toppers of all categories."
            link={{
              title: 'Start Earning',
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
          title="Up Your iOS and Swift Development Skills"
          text="Pellentesque non dignissim neque. Nunc vel rhoncus nibh, ut tincidunt turpis. Integer ac enim pellentesque, adipiscing metus id, pharetra odio."
          link={{
            title: 'Browse resources',
            url: 'learn',
          }}
        />
        <ResourceCard
          icon={IconMedal}
          title="Take the First Steps to Stand Out in the Community"
          text="Donec bibendum nunc sit amet tortor scelerisque luctus et sit amet mauris. Suspendisse felis sem, condimentum ullamcorper est sit amet, molestie"
          link={{
            title: 'Learn about badges',
            url: 'leaderboard',
          }}
        />
        <ResourceCard
          icon={IconRocket}
          title="Compete in Challenges and Win Cash"
          text="Suspendisse felis sem, condimentum ullamcorper est sit amet, molestie mollis nulla. Etiam lorem orci, consequat ac magna quis, facilisis"
          link={{
            title: 'Browse challenges',
            url: 'challenges',
          }}
        />
      </Section>

      <NewsSection news={props.news} />

      <NewsletterSignup
        title="Sign up for our newsletter"
        text="Don’t miss out on the latest Topcoder IOS challenges and information!"
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
