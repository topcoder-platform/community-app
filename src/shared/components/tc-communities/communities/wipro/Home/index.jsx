/**
 * Static implementation of Home page for Wipro 2 community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */

import Banner from 'components/Contentful/Banner';
import ContentfulLoader from 'containers/ContentfulLoader';
import React from 'react';
import Section from 'components/tc-communities/Section';
import ImageText from 'components/tc-communities/ImageText';
import LoadingIndicator from 'components/LoadingIndicator';
/*
import ResourceCard from 'components/tc-communities/ResourceCard';
import NewsSection from 'components/tc-communities/NewsSection';
*/

import { noop } from 'lodash';
import { config, Link } from 'topcoder-react-utils';

// import Slider from 'react-slick';

import PT from 'prop-types';

import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import CommunityStats from 'containers/tc-communities/CommunityStats';

/*
import IconRocket from '../../../../../../assets/images/tc-communities/rocket.svg';
import IconNetwork from '../../../../../../assets/images/tc-communities/network.svg';
import IconMedal from '../../../../../../assets/images/tc-communities/medal.svg';
*/

import style from './style.scss';
import IconStatStyles from './themes/IconStatStyles.scss';
// import NewsletterSignupStyle from './themes/newsletter_signup.scss';
import ImageTextStyles from './themes/imageTextStyle.scss';
// import ResourceCardStyles from './themes/resourceCardStyles.scss';
// import ArticleCardStyles from './themes/articleCardStyles.scss';
// import NewsSectionStyles from './themes/newsSectionStyles.scss';

// Custom icons for community stats
const COMMUNITY_STATS_ICONS = {
  numChallenges: '../../../../../community-app-assets/themes/wipro/challenges.png',
  numMembers: '../../../../../community-app-assets/themes/wipro/members.png',
  openPrizes: '../../../../../community-app-assets/themes/wipro/prizes.png',
};

function PrevArrow({
  className,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`${style.PrevArrow} ${className.indexOf('slick-disabled') > -1 ? style.disabled : ''}`}
      type="button"
    />
  );
}

function NextArrow({
  className,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`${style.NextArrow} ${className.indexOf('slick-disabled') > -1 ? style.disabled : ''}`}
      type="button"
    />
  );
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

/*
const settings = {
  dots: false,
  infinite: false,
  autoplay: false,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
  slidesToShow: 3,
  slidesToScroll: 1,
  className: style.carouselContainer,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        dots: true,
      },
    },
    {
      breakpoint: 768,
      settings: 'unslick',
    },
  ],
};
*/

export default function Home(props) {
  const {
    userId,
    resetChallengeListing,
  } = props;

  return (
    <main>
      <ContentfulLoader
        entryQueries={{
          content_type: 'banner',
          'fields.name': 'TopGear - Home - Banner',
        }}
        render={d => d.entries.matches[0].items
          .map(id => <Banner id={id} spaceName="topgear" />)}
        renderPlaceholder={LoadingIndicator}
        spaceName="topgear"
      />

      <CommunityStats theme={IconStatStyles} icons={COMMUNITY_STATS_ICONS} />

      <JoinCommunity />

      <Section
        theme={{
          container: style.linksContainer,
        }}
      >
        <div>
          <ImageText
            title="Leverage The Crowd"
            text="Access your on-demand community of designers and technology experts."
            link={[{
              newTab: true,
              title: 'Initiate Project',
              url: `${config.URL.TOPGEAR}/topcoder_projects/initiate_project?user_id=${userId}`,
            }, {
              newTab: true,
              title: 'Add me to account groups',
              url: 'https://topgear-app.wipro.com/topgear_groups/confirm_group_membership',
            }, {
              newTab: true,
              title: 'Reusable Components',
              url: 'https://wipro365.sharepoint.com/sites/ipgateway/SiteContent/Components.aspx',
            }]}
            theme={ImageTextStyles}
            imageSrc="/community-app-assets/themes/wipro/home/image-text-leverage.png"
          />
          <ImageText
            title="Get Involved"
            text="Rewards program is intended to celebrate and recognize your contribution. Rewards for project contributions are given using ‘Reward Points’. Points earned translate into badges. Quarterly rewards are given away to the toppers of all categories."
            link={[{
              title: 'Start Earning',
              url: 'challenges',
            }]}
            theme={ImageTextStyles}
            imageSrc="/community-app-assets/themes/wipro/home/image-text-do.png"
          />
          <ImageText
            title="Improve Your Skills"
            text="Our continuously evolving structured learning paths are customized to deepen your knowledge and help you acquire industry specific software capabilities. To keep abreast of emerging new technologies and succeed in this rapidly changing technology landscape. Click below to visit TopGear."
            link={{
              newTab: true,
              title: 'Start Learning',
              url: 'https://topgear-app.wipro.com/',
            }}
            theme={ImageTextStyles}
            imageSrc="/community-app-assets/themes/wipro/home/image-text-learn.png"
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
            onClick={() => resetChallengeListing()}
            styleName="ImageTextStyles.link"
            to="challenges?communityId="
          >
            View All Public Challenges
          </Link>
        </div>
      </Section>

    </main>
  );
}

Home.defaultProps = {
  userId: 0,
};

Home.propTypes = {
  resetChallengeListing: PT.func.isRequired,
  userId: PT.number,
};
