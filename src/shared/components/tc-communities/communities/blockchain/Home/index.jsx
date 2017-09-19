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
// import ResourceCard from 'components/tc-communities/ResourceCard';
// import NewsSection from 'components/tc-communities/NewsSection';
// import PT from 'prop-types';

import JoinCommunity from 'containers/tc-communities/JoinCommunity';

// import IconRocket from '../../../../../../assets/images/tc-communities/rocket.svg';
// import IconNetwork from '../../../../../../assets/images/tc-communities/network.svg';
// import IconMedal from '../../../../../../assets/images/tc-communities/medal.svg';

import style from './style.scss';

export default function Home(/* props */) {
  return (
    <main>
      <Banner
        title="The Topcoder Blockchain Community"
        text="Powered By ConsenSys"
        imageSrc="/themes/blockchain/home/banner.png"
      >
        <JoinCommunity
          theme={{ link: style.joinNow }}
          label="Join Now"
        />
      </Banner>
      <Section
        theme={{
          container: style.introContainer,
        }}
      >
        <div>
          <h1>Learn How to Build Next-Generation, Decentralized Applications with Ethereum Blockchain</h1>
          <p>Ethereum is a decentralized platform that runs smart contracts: applications that run exactly as programmed without any possibility of downtime, censorship, fraud or third party interference.</p>
          <p>Ethereum joins the security of blockchain technology with the expressiveness and objectivity of coded applications. With a distributed ledger on Ethereum, companies and individuals gain real-time transparency into transactions, costs, and security which in turn builds trust — and delivers enterprise-grade results.</p>
          <p>Over the coming weeks we will be adding educational resources, fun challenges to help you hone your skills, and competitive challenges to work on real-world customer projects with Ethereum blockchain.</p>
        </div>
      </Section>

      <Section
        theme={{
          container: style.linksContainer,
        }}
      >
        <div>
          <ImageText
            title="Get Started"
            text="Ready to get started with Ethereum? Topcoder and ConsenSys have partnered to give you access to tools, tutorials, and hands-on challenges to help you master Ethereum blockchain technology."
            imageSrc="/themes/blockchain/home/image-text-learn.png"
          />
          <ImageText
            title="Get Involved"
            text="Meet like-minded peers from around the world, share tips and insights, and collaborate with customers to build cutting-edge solutions. The Topcoder Blockchain Community provides opportunities to learn from Ethereum blockchain experts and work with top companies that are embracing blockchain technology."
            imageSrc="/themes/blockchain/home/image-text-do.jpg"
          />
        </div>
      </Section>

      {/*
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
      */}

    </main>
  );
}

/*
Home.defaultProps = {
  news: [],
};

Home.propTypes = {
  news: PT.arrayOf(PT.shape()),
};
*/
