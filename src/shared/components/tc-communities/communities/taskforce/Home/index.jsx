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
import NewsSection from 'components/tc-communities/NewsSection';
import PT from 'prop-types';
import Text from 'components/tc-communities/Text';

import CommunityStats from 'containers/tc-communities/CommunityStats';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import joinButtonStyle from 'components/buttons/outline/round/open-sans/green-uppercase.scss';

import IconRocket from '../../../../../../assets/images/tc-communities/rocket.svg';
import IconNetwork from '../../../../../../assets/images/tc-communities/network.svg';
import IconMedal from '../../../../../../assets/images/tc-communities/medal.svg';

import style from './style.scss';

export default function Home({ news }) {
  return (
    <main>
      <Banner
        title="Get work done faster with Topcoder TaskForce"
        text="Time. It’s our most precious resource. You have projects and work where you need to go faster, we have amazing design and development talent, ready to work right now. Let’s get it done."
        link={[{
          title: 'Why Topcoder TaskForce',
          url: '#why-topcoder-taskforce',
        }, {
          title: 'Create a Task Right Now',
          url: '.',
        }]}
        imageSrc="/community-app-assets/themes/taskforce/home/banner.jpg"
        theme={{
          content: style.BannerContent,
          link: style.BannerLink,
          linkWrap: style.BannerLinkWrapper,
        }}
      />

      <CommunityStats
        /* TODO: Don't forget that stats are hard-coded here for demo-purposes!
         * Should be switch back to stats from Redux store in future. */
        stats={{
          openTasks: 117,
          numCompanies: 81,
          work: '$16,542',
        }}
      />

      <JoinCommunity theme={{ link: joinButtonStyle, container: style.joinContainer }} />

      <Section
        anchor="why-topcoder-taskforce"
        theme={{
          container: style.linksContainer,
        }}
        title="Why Topcoder TaskForce?"
      >
        <div>
          <ImageText
            title="No Matchmaking, No&nbsp;Hoping"
            text="Hope is not a strategy. While other sites that offer technology tasks ask you to do the heavy lifting from start to finish, Topcoder TaskForce is purposefully different. You will never be asked to surf a member base, muck through ratings, and ultimately make a decision that you hope is a strong one. On Topcoder TaskForce we first understand your goals and put the right talent in place so you can succeed with ease. Stop playing matchmaker and simply focus on what you want achieved. "
            link={{
              title: 'Launch a Task',
              url: '.',
            }}
            imageSrc="/community-app-assets/themes/taskforce/home/image-text-do.jpg"
            theme={{
              container: style.ImageTextContainer,
            }}
          />
          <ImageText
            title="Never Go It Alone"
            text="On other sites it can feel as if you’re left on an island… a deserted island. With Topcoder not only are you paired with the right talent, but you are also provided your very own Copilot. Think of them as your task sherpa and they are all yours. They interface with you, discuss the work, make sure we’re all aligned and then work directly with the paired talent to get this executed for you. It’s like having your very own crowdsourcing concierge and it’s only available on Topcoder."
            link={{
              title: 'Launch a Task',
              url: '.',
            }}
            imageSrc="/community-app-assets/themes/taskforce/home/working-desk.jpg"
          />
        </div>
      </Section>

      <Section
        theme={{
          container: style.WhatCanYouGetDone,
        }}
        title="What Can You Get Done?"
      >
        <Text>
          <p>
            Through Topcoder TaskForce you can easily and quickly get quality design, development, and data tasks accomplished. No matchmaking, no searching for talent, simply tell us what you need done and we’ll take care of the rest.
          </p>
        </Text>
      </Section>

      <Section
        theme={{
          container: style.resourcesContainer,
        }}
      >
        <ResourceCard
          icon={IconNetwork}
          title="Top designers are ready to understand your vision and help you bring it to life fast."
          link={{
            title: 'Launch a Design Task',
            url: '.',
          }}
        />
        <ResourceCard
          icon={IconMedal}
          title="Get a specialized developer working on your project today."
          link={{
            title: 'Launch a Development Task',
            url: '.',
          }}
        />
        <ResourceCard
          icon={IconRocket}
          title="Data scientists and algorithmists are hard to come by, but we make it easy."
          link={{
            title: 'Launch a Data Science Task',
            url: '.',
          }}
        />
      </Section>

      <NewsSection news={news} />

    </main>
  );
}

Home.defaultProps = {
  news: [],
};

Home.propTypes = {
  news: PT.arrayOf(PT.shape()),
};
