/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/destructuring-assignment */
/**
 * SlashTC index container
 */
import React, { useEffect } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { isTokenExpired } from '@topcoder-platform/tc-auth-lib';
import { config } from 'topcoder-react-utils';
import Viewport from 'components/Contentful/Viewport';
import TopcoderTime from 'components/Dashboard/TCTime';
import ThriveArticlesFeedContainer from 'containers/Dashboard/ThriveArticlesFeed';
import GigsFeed from 'containers/Dashboard/GigsFeed';
import ChallengesFeed from 'containers/Dashboard/ChallengesFeed';
import BlogFeedContainer from 'containers/Dashboard/BlogFeed';
import MetaTags from 'components/MetaTags';
import NewsFeed from './NewsFeed';
import darkTheme from './themes/dark.scss';

const THEMES = {
  dark: darkTheme,
};

const INNOVATION_CHALLENGES_TAG = config.INNOVATION_CHALLENGES_TAG;

function SlashTCContainer(props) {
  const theme = THEMES.dark; // for v1 only dark theme
  const isTabletOrMobile = useMediaQuery({ maxWidth: 768 });
  const title = 'Home | Topcoder';

  useEffect(() => {
    if (props.tokenV3 && !isTokenExpired(props.tokenV3)) return;
    let url = `retUrl=${encodeURIComponent(location.href)}`;
    url = `${config.URL.AUTH}/member?${url}&utm_source=community-app-home-page`;
    location.href = url;
  }, [props.tokenV3]);

  return (
    <div className={theme.container}>
      <MetaTags
        title={title}
      />
      {
        // Render different stacking of components for tables&mobile devices
        isTabletOrMobile ? (
          <div className={theme.layoutWrapper}>
            <div className={theme.column}>
              <TopcoderTime />
              <Viewport id="1BK50OyMT29IOavUC7wSEB" />
              <ChallengesFeed
                theme="dark"
                title="INNOVATION CHALLENGES"
                tags={[INNOVATION_CHALLENGES_TAG]}
                challengeListingQuery={{ search: INNOVATION_CHALLENGES_TAG }}
                tracks={[]}
                itemCount={20}
              />
              <ChallengesFeed theme="dark" excludeTags={[INNOVATION_CHALLENGES_TAG]} />
              <GigsFeed itemCount={5} theme="dark" />
              <NewsFeed />
              <Viewport id="SSwOFPT8l0WpGhqCBRISG" />
              <ThriveArticlesFeedContainer itemCount={4} theme="dark" />
              <BlogFeedContainer itemCount={4} theme="dark" />
              <Viewport id="6sjlJHboX3aG3mFS5FnZND" />
            </div>
          </div>
        ) : (
          <div className={theme.layoutWrapper}>
            {/* Left column */}
            <div className={theme.column}>
              <TopcoderTime />
              <ThriveArticlesFeedContainer itemCount={4} theme="dark" />
              <BlogFeedContainer itemCount={4} theme="dark" />
              <Viewport id="6sjlJHboX3aG3mFS5FnZND" />
            </div>
            {/* Center column */}
            <div className={theme.column}>
              <Viewport id="1BK50OyMT29IOavUC7wSEB" />
              <ChallengesFeed
                theme="dark"
                title="INNOVATION CHALLENGES"
                tags={[INNOVATION_CHALLENGES_TAG]}
                challengeListingQuery={{ search: INNOVATION_CHALLENGES_TAG }}
                tracks={[]}
                itemCount={20}
              />
              <ChallengesFeed theme="dark" excludeTags={[INNOVATION_CHALLENGES_TAG]} />
              <GigsFeed itemCount={5} theme="dark" />
              <NewsFeed />
            </div>
            {/* Right column */}
            <div className={theme.column}>
              <Viewport id="SSwOFPT8l0WpGhqCBRISG" />
            </div>
          </div>
        )
      }
    </div>
  );
}

SlashTCContainer.defaultProps = {
  profile: null,
  tokenV3: null,
};

SlashTCContainer.propTypes = {
  profile: PT.shape(),
  tokenV3: PT.string,
};

function mapStateToProps(state) {
  const profile = state.auth && state.auth.profile ? { ...state.auth.profile } : {};
  return {
    profile,
    tokenV3: state.auth.tokenV3,
  };
}

export default connect(
  mapStateToProps,
)(SlashTCContainer);
