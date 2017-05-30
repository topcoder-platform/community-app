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
import ArticleCard from 'components/tc-communities/ArticleCard';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';

import IconSuitcase from '../../../../../../assets/images/tc-communities/suitcase.svg';
import IconRocket from '../../../../../../assets/images/tc-communities/rocket.svg';
import IconMember from '../../../../../../assets/images/tc-communities/member.svg';
import IconDollar from '../../../../../../assets/images/tc-communities/dollar.svg';
import IconNetwork from '../../../../../../assets/images/tc-communities/network.svg';
import IconMedal from '../../../../../../assets/images/tc-communities/medal.svg';

import style from './style.scss';

export default function Home() {
  return (
    <main>
      <Banner
        title="iOS"
        text="You’re eager to get started, and we have a bunch of iOS/Swift challenges lined up to give you new opportunities to earn cash. We also have an exclusive iOS badging program to prove your app design and development expertise, so dive in and start competing!"
        link={{
          title: 'Compete Now',
          url: '/community/wipro2/home',
        }}
        imageSrc="/themes/wipro2/home/banner.jpg"
      />

      <Section
        theme={{
          container: style.statsContainer,
          content: style.statsContent,
        }}
      >
        <IconStat icon={IconSuitcase} number="5" label="Projects" />
        <IconStat icon={IconRocket} number="12" label="Challenges" />
        <IconStat icon={IconMember} number="347" label="Members" />
        <IconStat icon={IconDollar} number="$10K" label="Prizes" />
      </Section>

      <Section
        theme={{
          container: style.linksContainer,
        }}
      >
        <div>
          <ImageText
            title="Learn"
            text="You can learn and get certified donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien metus, scelerisque nec pharetra id, tempor a tortor. Pellentesque non dignissim neque. Ut porta viverra est, ut dignissim elit"
            link={{
              title: 'Start Learning',
              url: '/community/wipro2/home',
            }}
            imageSrc="/themes/wipro2/home/image-text-learn.jpg"
          />
          <ImageText
            title="Do Work"
            text="Jump into challenges and start competing sed sapien metus, scelerisque nec pharetra id, tempor a tortor. Pellentesque non dignissim neque. Nunc vel rhoncus nibh, ut tincidunt turpis."
            link={{
              title: 'Start Learning',
              url: '/community/wipro2/home',
            }}
            imageSrc="/themes/wipro2/home/image-text-do.jpg"
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
            url: '/community/wipro2/home',
          }}
        />
        <ResourceCard
          icon={IconMedal}
          title="Take the First Steps to Stand Out in the Community"
          text="Donec bibendum nunc sit amet tortor scelerisque luctus et sit amet mauris. Suspendisse felis sem, condimentum ullamcorper est sit amet, molestie"
          link={{
            title: 'Learn about badges',
            url: '/community/wipro2/home',
          }}
        />
        <ResourceCard
          icon={IconRocket}
          title="Compete in Challenges and Win Cash"
          text="Suspendisse felis sem, condimentum ullamcorper est sit amet, molestie mollis nulla. Etiam lorem orci, consequat ac magna quis, facilisis"
          link={{
            title: 'Browse challenges',
            url: '/community/wipro2/home',
          }}
        />
      </Section>

      <Section
        title="Latest News"
      >
        <ArticleCard
          title="How Does An IOS 10 LCD Work"
          text="There are advances being made in science and technology everyday, and a good example of this is the LCD monitor. LCD monitors have"
          link={{
            title: 'Read More',
            url: '/community/wipro2/home',
          }}
          imageSrc="/themes/wipro2/home/news-01.jpg"
        />
        <ArticleCard
          title="Video Games Playing With Imagination"
          text="HDMI, or high definition multimedia interface, is a type of audio and video interface that is used for the transmission of uncompressed"
          link={{
            title: 'Read More',
            url: '/community/wipro2/home',
          }}
          imageSrc="/themes/wipro2/home/news-02.jpg"
        />
        <ArticleCard
          title="Myspace Layouts The Missing Element"
          text="If you are in the market for a computer, there are a number of factors to consider. Will it be used for your home, your office or"
          link={{
            title: 'Read More',
            url: '/community/wipro2/home',
          }}
          imageSrc="/themes/wipro2/home/news-03.jpg"
        />
      </Section>

      <NewsletterSignup
        title="Sign up for our newsletter"
        text="Don’t miss out on the latest Topcoder IOS challenges and information!"
        imageSrc="/themes/wipro2/subscribe-bg.jpg"
      />

    </main>
  );
}
