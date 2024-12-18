/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/destructuring-assignment */
/**
 * SlashTC index container
 */
import React, { useEffect, useMemo } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { isTokenExpired } from '@topcoder-platform/tc-auth-lib';
import { config } from 'topcoder-react-utils';
import Viewport from 'components/Contentful/Viewport';
import TopcoderTime from 'components/Dashboard/TCTime';
import ThriveArticlesFeedContainer from 'containers/Dashboard/ThriveArticlesFeed';
// deprecated with https://topcoder.atlassian.net/browse/CORE-346
// import GigsFeed from 'containers/Dashboard/GigsFeed';
import ChallengesFeed from 'containers/Dashboard/ChallengesFeed';
import BlogFeedContainer from 'containers/Dashboard/BlogFeed';
import MetaTags from 'components/MetaTags';
// deprecated with https://topcoder.atlassian.net/browse/TOP-1390
// import NewsFeed from './NewsFeed';
import darkTheme from './themes/dark.scss';
import lightTheme from './themes/light.scss';

const THEMES = {
  dark: darkTheme,
  light: lightTheme,
};
const { INNOVATION_CHALLENGES_TAG } = config;

function SlashTCContainer(props) {
  const theme = THEMES.light;
  const isTabletOrMobile = useMediaQuery({ maxWidth: 768 });
  const title = 'Home | Topcoder';
  const challengeListingQuery = {
    search: INNOVATION_CHALLENGES_TAG,
    isInnovationChallenge: true,
  };
  const isDevEnv = useMemo(() => config.URL.BASE.includes('-dev'), []);

  useEffect(() => {
    if (props.tokenV3 && !isTokenExpired(props.tokenV3)) return;
    let url = `retUrl=${encodeURIComponent(`${window.location.origin}${window.location.pathname}`)}`;
    url = `${config.URL.AUTH}/member?${url}&utm_source=community-app-home-page`;
    location.href = url;
  }, [props.tokenV3]);

  return (
    <div className={theme.container}>
      <MetaTags title={title} />
      {
        // Render different stacking of components for tables&mobile devices
        isTabletOrMobile ? (
          <div className={theme.layoutWrapper}>
            <div className={theme.column}>
              <TopcoderTime />
              { isDevEnv ? <Viewport id="IYMEHgYwk6S0S9tx5SsHd" /> : <Viewport id="1BK50OyMT29IOavUC7wSEB" /> }
              <ChallengesFeed
                theme="light"
                excludeTags={[INNOVATION_CHALLENGES_TAG]}
              />
              <ChallengesFeed
                theme="light"
                title="INNOVATION CHALLENGES"
                tags={[INNOVATION_CHALLENGES_TAG]}
                challengeListingQuery={challengeListingQuery}
                tracks={[]}
                itemCount={20}
              />
              {/* deprected with https://topcoder.atlassian.net/browse/CORE-346 */}
              {/* <GigsFeed itemCount={5} theme="dark" /> */}
              {/* deprecated with https://topcoder.atlassian.net/browse/TOP-1390 */}
              {/* <NewsFeed /> */}
              { isDevEnv ? <Viewport id="2qVJTorSdRVNlfRqoQocUH" /> : <Viewport id="SSwOFPT8l0WpGhqCBRISG" /> }
              <ThriveArticlesFeedContainer itemCount={4} theme="light" />
              <BlogFeedContainer itemCount={4} theme="light" />
              { isDevEnv ? <Viewport id="2tq6jtu9GzPab7lAb7swlT" /> : <Viewport id="6sjlJHboX3aG3mFS5FnZND" /> }
            </div>
          </div>
        ) : (
          <div className={theme.layoutWrapper}>
            {/* Left column */}
            <div className={theme.column}>
              <TopcoderTime />
              <ThriveArticlesFeedContainer itemCount={4} theme="light" />
              <BlogFeedContainer itemCount={4} theme="light" />
              { isDevEnv ? <Viewport id="2tq6jtu9GzPab7lAb7swlT" /> : <Viewport id="6sjlJHboX3aG3mFS5FnZND" /> }
            </div>
            {/* Center column */}
            <div className={theme.column}>
              { isDevEnv ? <Viewport id="IYMEHgYwk6S0S9tx5SsHd" /> : <Viewport id="1BK50OyMT29IOavUC7wSEB" /> }
              <ChallengesFeed
                theme="light"
                excludeTags={[INNOVATION_CHALLENGES_TAG]}
              />
              <ChallengesFeed
                theme="light"
                title="Innovation Challenges"
                tags={[INNOVATION_CHALLENGES_TAG]}
                challengeListingQuery={challengeListingQuery}
                tracks={[]}
                itemCount={20}
              />
              {/* deprected with https://topcoder.atlassian.net/browse/CORE-346 */}
              {/* <GigsFeed itemCount={5} theme="dark" /> */}
              {/* deprecated with https://topcoder.atlassian.net/browse/TOP-1390 */}
              {/* <NewsFeed /> */}
            </div>
            {/* Right column */}
            <div className={theme.column}>
              { isDevEnv ? <Viewport id="2qVJTorSdRVNlfRqoQocUH" /> : <Viewport id="SSwOFPT8l0WpGhqCBRISG" /> }
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

export default connect(mapStateToProps)(SlashTCContainer);
