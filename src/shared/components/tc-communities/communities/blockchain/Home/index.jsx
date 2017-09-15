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
        title="Topcoder Blockchain Community"
        text="Learn about and build the next great decentralized application on the Ethereum Blockchain."
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
          <h1>Build Trustworthy, Unstoppable, Decentralized Applications with Ethereum</h1>
          <p>Ethereum is a decentralized platform that runs smart contracts: applications that run exactly as programmed without any possibility of downtime, censorship, fraud or third party interference.</p>
          <p>Ethereum joins the security of blockchain technology with the expressiveness and objectivity of coded applications. With a distributed ledger on Ethereum, companies and individuals gain real-time transparency into transactions, costs, and security which in turn builds trust.</p>
        </div>
      </Section>

      <Section
        theme={{
          container: style.linksContainer,
        }}
      >
        <div>
          <ImageText
            title="Ramp Up"
            text="Looking to get involved in Topcoder projects being built on Ethereum? Then this is the best place to start. Learn everything you need to know about mastering the Ethereum blockchain from the industry leader, ConsenSys."
            imageSrc="/themes/blockchain/home/image-text-learn.png"
          />
          <ImageText
            title="Get Involved"
            text="The Ethereum blockchain is the ideal platform for businesses and developers. In partnering with ConsenSys, we have given our community the ability to be at the forefront of this cutting edge technology. So what are you waiting for? Start building on the Ethereum Blockchain today! "
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
