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
import ResourceCard2 from 'components/tc-communities/ResourceCard2';
import NewsSection from 'components/tc-communities/NewsSection';
import PT from 'prop-types';

import CommunityStats from 'containers/tc-communities/CommunityStats';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';

import IconRocket from '../../../../../../assets/images/tc-communities/rocket.svg';
import IconNetwork from '../../../../../../assets/images/tc-communities/network.svg';
import IconMedal from '../../../../../../assets/images/tc-communities/medal.svg';

import resourceCardStyle from '../themes/resource-card.scss';
import style from './style.scss';
import joinButtonStyle from '../themes/join-button.scss';
import textSectionStyle from '../themes/text-section.scss';

export default function Home({
  member,
  news,
}) {
  return (
    <main>
      <Banner
        title="Topcoder QA Community"
        imageSrc="/community-app-assets/themes/qa/home/header.jpg"
      >
        <div className={style.bannerText}>
          {member ? (
            'This is the place where Topcoder members can come to focus on work that involves QA.'
          ) : (
            <span>
              Sign up. &laquo;Test&raquo; your skills. Get Rewarded.
              &zwnj;<span className={style.highlighted}>It&apos;s that simple!</span>
            </span>
          )}
        </div>
        { !member && (
          <JoinCommunity
            theme={{ link: joinButtonStyle }}
            label="Join Now"
          />
        )}
      </Banner>

      <Section theme={textSectionStyle}>
        <p>
          One of the key drivers of Digital Transformation within large
          organizations is the mass consumerization of technology. In the brave
          new ‘connected’ world, organizations are forced to adopt new
          technologies to keep pace with the digitalization.
        </p>
        <p>
          Testing is also part of this transformation and plays a critical role
          in the organization’s business strategy. It bears striking similarity
          to the ‘pit stop’ paradigm in Formula One racing. The modern pit stop
          is a fascinating choreography of technology execution and efficiency
          that separates the winners from the crowd. This is very similar to
          how we see Quality Engineering in the new world. The nirvana state of
          driving ‘Zero Cost of Quality’ which was the primary goal of
          Enterprise IT of yesteryear, has progressively transformed to drive
          ‘Quality at zero impedance’.
        </p>
        <p>
          We are on the look-out for individuals who can run our ‘pit stops’ as
          we move to our next orbits of growth. So what are you waiting for?
          Come join us, the world’s best QA community!
        </p>
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
            url: 'learn',
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

      <CommunityStats />

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
            imageSrc="/community-app-assets/themes/qa/home/image-ramp-up.jpg"
          />
          <ImageText
            title="Get Involved"
            text="Whether you're a QA specialist, copilot, designer, developer, or data scientist... we want you involved. Topcoder is one of the biggest customers of our own platform, so there is never a shortage of interesting things to work on."
            link={{
              title: 'Start Contributing',
              url: 'challenges',
            }}
            imageSrc="/community-app-assets/themes/qa/home/image-get-involved.jpg"
          />
        </div>
      </Section>

      <Section
        theme={{
          container: style.resourcesContainer2,
        }}
      >
        <ResourceCard2
          theme={{
            ...resourceCardStyle,
            container: style.bgBlue,
          }}
          title="State of Quality Edition 1"
          text="An investigative report into the current state of Testing, and its evolution into Quality Engineering and Assurance."
          link={{
            openNewTab: true,
            title: 'Learn More',
            url: 'http://www.wipro.com/microsite/state-of-quality-2016/index.php',
          }}
        />
        <ResourceCard2
          theme={{
            ...resourceCardStyle,
            container: style.bgGray,
          }}
          title="Why QA Needs to be Invisible and Why Engineering Quality should be Your Ultimate Goal"
          text="&laquo;Isn't Software Testing dead?&raquo; Over the last couple of years, this though (or something similar to it) seems to be the most debated, commented and argued over."
          link={{
            openNewTab: true,
            title: 'Learn More',
            url: 'http://www.dqindia.com/why-qa-needs-to-be-invisible-and-why-engineering-quality-should-be-your-ultimate-goal/',
          }}
        />
        <ResourceCard2
          theme={{
            ...resourceCardStyle,
            container: style.bgYellow,
          }}
          title="Digital Assurance Perspectives"
          text="Digital Assurance has moved focus from functional validation of &laquo;commerce&raquo; on multiple channels in silos towards an omni-channel experience."
          link={{
            openNewTab: true,
            title: 'Learn More',
            url: 'http://www.wipro.com/blogs/digital-assurance-perspectives/',
          }}
        />
        <ResourceCard2
          theme={{
            ...resourceCardStyle,
            container: style.bgGreen,
          }}
          title="Assuring a mobile future"
          text="Traditional QA methodologies unfortunately tend to fail in the mobility landscape due to various factors due to which organizations need to adapt and transform the way QA is carried out."
          link={{
            openNewTab: true,
            title: 'Learn More',
            url: 'http://www.wipro.com/blogs/assuring-a-mobile-future-part-i/',
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
  member: PT.bool.isRequired,
  news: PT.arrayOf(PT.shape()),
};

