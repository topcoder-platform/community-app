/**
 * Static implementation of Home page for Cognitive community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */
/* eslint-disable max-len */


import React from 'react';
import Section from 'components/tc-communities/Section';
import Banner from 'components/tc-communities/Banner';
import ImageText from 'components/tc-communities/ImageText';
/*
import ResourceCard from 'components/tc-communities/ResourceCard';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import NewsSection from 'components/tc-communities/NewsSection';
*/

import { noop } from 'lodash';
import { Link } from 'utils/router';

// import Slider from 'react-slick';

import PT from 'prop-types';

// import JoinCommunity from 'containers/tc-communities/JoinCommunity';
// import CommunityStats from 'containers/tc-communities/CommunityStats';

/*
import IconRocket from '../../../../../../assets/images/tc-communities/rocket.svg';
import IconNetwork from '../../../../../../assets/images/tc-communities/network.svg';
import IconMedal from '../../../../../../assets/images/tc-communities/medal.svg';
*/

import style from './style.scss';
import bannerStyle from './themes/banner.scss';
// import IconStatStyles from './themes/IconStatStyles.scss';
// import NewsletterSignupStyle from './themes/newsletter_signup.scss';
import ImageTextStyles from './themes/imageTextStyle.scss';
// import ResourceCardStyles from './themes/resourceCardStyles.scss';
// import ArticleCardStyles from './themes/articleCardStyles.scss';
// import NewsSectionStyles from './themes/newsSectionStyles.scss';

// Custom icons for community stats
// const COMMUNITY_STATS_ICONS = {
//   numChallenges: '../../../../../community-app-assets/themes/wipro/challenges.png',
//   numMembers: '../../../../../community-app-assets/themes/wipro/members.png',
//   openPrizes: '../../../../../community-app-assets/themes/wipro/prizes.png',
// };

function PrevArrow(props) {
  return (
    <button
      onClick={props.onClick}
      className={`${style.PrevArrow} ${props.className.indexOf('slick-disabled') > -1 ? style.disabled : ''}`}
    />);
}

function NextArrow(props) {
  return (
    <button
      onClick={props.onClick}
      className={`${style.NextArrow} ${props.className.indexOf('slick-disabled') > -1 ? style.disabled : ''}`}
    />);
}

PrevArrow.defaultProps = {
  className: '',
  onClick: noop,
};

PrevArrow.propTypes = {
  className: PT.string,
  onClick: PT.func,
};

NextArrow.defaultProps = {
  className: '',
  onClick: noop,
};

NextArrow.propTypes = {
  className: PT.string,
  onClick: PT.func,
};

export default function Home(props) {
  return (
    <main>
      <Banner
        title="Topcoder Cognitive Community"
        text="Learn about Cognitive technologies and get hands on experience as a member of the Topcoder Cognitive Community."
        link={{
          title: 'Sign Up Now',
          url: 'register',
        }}
        imageSrc="/community-app-assets/themes/cognitive/home/banner.jpg"
        theme={bannerStyle}
      />

      { /* <JoinCommunity /> */ }

      <Section
        theme={{
          container: style.linksContainer,
        }}
      >
        <div>
          <ImageText
            title="Improve Your Skills"
            text="Our continuously evolving structured learning paths are customized to deepen your knowledge and help you acquire industry specific software capabilities. To keep abreast of emerging new technologies and succeed in this rapidly changing technology landscape. Click below to visit TopGear."
            link={{
              title: 'Start Learning',
              url: 'learn',
            }}
            theme={ImageTextStyles}
            imageSrc="/community-app-assets/themes/wipro/home/image-text-learn.png"
          />
          <ImageText
            title="Get Involved"
            text="Rewards program is intended to celebrate and recognize your contribution. Rewards for project contributions are given using ‘Reward Points’. Points earned translate into badges. Quarterly rewards are given away to the toppers of all categories."
            link={[{
              title: 'Start Earning',
              url: 'challenges',
            }, {
              newTab: true,
              title: 'Become a Reviewer',
              url: 'https://help.topcoder.com/hc/requests/new',
            }, {
              newTab: true,
              title: 'Become a Copilot',
              url: 'https://help.topcoder.com/hc/requests/new',
            }]}
            theme={ImageTextStyles}
            imageSrc="/community-app-assets/themes/wipro/home/image-text-do.png"
          />
          <ImageText
            title="Leverage The Crowd"
            text="Access your on-demand community of designers and technology experts."
            link={[{
              newTab: true,
              title: 'Initiate Project',
              url: 'https://connect.topcoder.com/new-project/generic_dev?refCode=topgear',
            }, {
              newTab: true,
              title: 'Request Group',
              url: 'https://help.topcoder.com/hc/en-us/requests/new?ticket_form_id=779747',
            }]}
            theme={ImageTextStyles}
            imageSrc="/community-app-assets/themes/wipro/home/image-text-leverage.png"
          />
        </div>
      </Section>

      <Section
        theme={{
          container: style.viewAllPublicChallengesContainer,
          content: style.viewAllPublicChallenges,
        }}
      >
        <div styleName="ImageTextStyles.linkWrap style.linkWrap">
          <Link
            onClick={() => props.resetChallengeListing()}
            styleName="ImageTextStyles.link"
            to="challenges?communityId="
          >View All Public Challenges</Link>
        </div>
      </Section>
    </main>
  );
}

Home.defaultProps = {
  news: [],
};

Home.propTypes = {
  // news: PT.arrayOf(PT.shape()),
  resetChallengeListing: PT.func.isRequired,
};
