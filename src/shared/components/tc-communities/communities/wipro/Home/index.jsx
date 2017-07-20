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

import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import CommunityStats from '../CommunityStats';

import IconRocket from '../../../../../../assets/images/tc-communities/rocket.svg';
import IconNetwork from '../../../../../../assets/images/tc-communities/network.svg';
import IconMedal from '../../../../../../assets/images/tc-communities/medal.svg';

import style from './style.scss';
import bannerStyle from './themes/banner.scss';
import NewsletterSignupStyle from './themes/newsletter_signup.scss';
import ImageTextStyles from './themes/imageTextStyle.scss';
import ResourceCardStyles from './themes/resourceCardStyles.scss';
import ArticleCardStyles from './themes/articleCardStyles.scss';
import NewsSectionStyles from './themes/newsSectionStyles.scss';

export default function Home(props) {
  return (
    <main>
      <Banner
        title="Wipro Crowd"
        text="Wipro's Hybrid Crowd gives our vast ecosystem of customers and partners options to access new range of skills that provide new value services and efficiency options all over the world."
        link={{
          title: 'Compete Now',
          url: 'challenges',
        }}
        imageSrc="/themes/wipro/home/top_image.png"
        theme={bannerStyle}
      />

      <CommunityStats stats={props.stats} />

      <JoinCommunity />

      <Section
        theme={{
          container: style.linksContainer,
        }}
      >
        <div>
          <ImageText
            title="Improve Your Skills"
            text="Our continuously evolving structured learning paths, constantly abreast of the latest, tailored for employees to deepen your knowledge, infuses important software capabilities that are industry specific and help you get the skills you need to succeed. Click below to visit TopGear."
            link={{
              title: 'Start Learning',
              url: 'https://topgear.wipro.com',
            }}
            theme={ImageTextStyles}
            imageSrc="/themes/wipro/home/image-text-learn.jpg"
          />
          <ImageText
            title="Get Involved"
            text="Rewards program is intended to celebrate and recognize your contribution. Rewards for project contributions are given using ‘Reward Points’. Points earned translate into badges. Quarterly rewards are given away to the toppers of all categories."
            link={{
              title: 'Start Earning',
              url: 'challenges',
            }}
            theme={ImageTextStyles}
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
          theme={ResourceCardStyles}
          icon={IconNetwork}
          title="Up Your iOS and Swift Development Skills"
          text="Pellentesque non dignissim neque. Nunc vel rhoncus nibh, ut tincidunt turpis. Integer ac enim pellentesque, adipiscing metus id, pharetra odio."
          link={{
            title: 'Browse resources',
            url: 'https://topgear.wipro.com',
          }}
        />
        <ResourceCard
          theme={ResourceCardStyles}
          icon={IconMedal}
          title="Take the First Steps to Stand Out in the Community"
          text="Donec bibendum nunc sit amet tortor scelerisque luctus et sit amet mauris. Suspendisse felis sem, condimentum ullamcorper est sit amet, molestie"
          link={{
            title: 'Learn about badges',
            url: 'leaderboard',
          }}
        />
        <ResourceCard
          theme={ResourceCardStyles}
          icon={IconRocket}
          title="Compete in Challenges and Win Cash"
          text="Suspendisse felis sem, condimentum ullamcorper est sit amet, molestie mollis nulla. Etiam lorem orci, consequat ac magna quis, facilisis"
          link={{
            title: 'Browse challenges',
            url: 'challenges',
          }}
        />
      </Section>

      <NewsSection
        news={props.news}
        theme={{
          section: NewsSectionStyles,
          card: ArticleCardStyles,
        }}
      />

      <NewsletterSignup
        title="Sign up for our newsletter"
        text="Don’t miss out on the latest challenges and information!"
        imageSrc="/themes/wipro/subscribe-bg.jpg"
        theme={NewsletterSignupStyle}
      />

    </main>
  );
}

Home.defaultProps = {
  news: [],
  stats: {},
};

const numberOrString = PT.oneOfType([PT.number, PT.string]);

Home.propTypes = {
  news: PT.arrayOf(PT.shape()),
  stats: PT.shape({
    numChallenges: numberOrString,
    numMembers: numberOrString,
    numProjects: numberOrString,
    openPrizes: numberOrString,
  }),
};
