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

import CommunityStats from 'containers/tc-communities/CommunityStats';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';

import style from './style.scss';

export default function Home({
  member,
  news,
}) {
  return (
    <main>
      <Banner
        title="Topcoder QA Community"
        imageSrc="/themes/qa/home/header.jpg"
      >
        <div styleName="bannerText">
          {member ? (
            'This is the place where Topcoder members can come to focus on work that involves QA.'
          ) : (
            <span>
              Sign up. &laquo;Test&raquo; your skills. Get Rewarded.
              &zwnj;<span styleName="highlighted">It&apos;s that simple!</span>
            </span>
          )}
        </div>
        { !member && (
          <JoinCommunity
            theme={{ link: style.joinNow }}
            label="Join Now"
          />
        )}
      </Banner>

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
            imageSrc="/themes/qa/home/image-ramp-up.jpg"
          />
          <ImageText
            title="Get Involved"
            text="Whether you're a QA specialists, copilot, designer, developer, or data scientist... we want you involved. Topcoder is one of the biggest customers of our own platform, so there is never a shortage of interesting things to work on."
            link={{
              title: 'Start Contributing',
              url: 'challenges',
            }}
            imageSrc="/themes/qa/home/image-get-involved.jpg"
          />
        </div>
      </Section>

      <Section
        theme={{
          container: style.resourcesContainer2,
        }}
      >
        <ResourceCard
          theme={{
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
        <ResourceCard
          theme={{
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
        <ResourceCard
          theme={{
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
        <ResourceCard
          theme={{
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

