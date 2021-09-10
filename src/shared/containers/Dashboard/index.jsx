/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */
/**
 * SlashTC index container
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import Viewport from 'components/Contentful/Viewport';
import TopcoderTime from 'components/Dashboard/TCTime';
import ThriveArticlesFeedContainer from 'containers/Dashboard/ThriveArticlesFeed';
import GigsFeed from 'containers/Dashboard/GigsFeed';
import TCOLeaderboardsContainer from 'containers/Dashboard/TCOLeaderboards';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import ChallengesFeed from 'containers/Dashboard/ChallengesFeed';
import BlogFeedContainer from 'containers/Dashboard/BlogFeed';
import MetaTags from 'components/MetaTags';
import NewsFeed from './NewsFeed';
import darkTheme from './themes/dark.scss';

const THEMES = {
  dark: darkTheme,
};

function SlashTCContainer(props) {
  const theme = THEMES.dark; // for v1 only dark theme
  const isTabletOrMobile = useMediaQuery({ maxWidth: 768 });
  const title = 'Dashboard | Topcoder';
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
              <ChallengesFeed theme="dark" />
              <GigsFeed itemCount={5} theme="dark" />
              <NewsFeed />
              <ContentfulLoader
                entryIds={['5HmoppBlc79RfxOwb8JAls']}
                render={(data) => {
                  const confTCO = data.entries.items['5HmoppBlc79RfxOwb8JAls'];
                  if (confTCO) {
                    return (
                      <TCOLeaderboardsContainer
                        trackConfig={confTCO.fields.props}
                        itemCount={5}
                      />
                    );
                  }
                  return null;
                }}
                renderPlaceholder={LoadingIndicator}
              />
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
              <ChallengesFeed theme="dark" />
              <GigsFeed itemCount={5} theme="dark" />
              <NewsFeed />
            </div>
            {/* Right column */}
            <div className={theme.column}>
              <ContentfulLoader
                entryIds={['5HmoppBlc79RfxOwb8JAls']}
                render={(data) => {
                  const confTCO = data.entries.items['5HmoppBlc79RfxOwb8JAls'];
                  if (confTCO) {
                    return (
                      <TCOLeaderboardsContainer
                        trackConfig={confTCO.fields.props}
                        itemCount={5}
                      />
                    );
                  }
                  return null;
                }}
                renderPlaceholder={LoadingIndicator}
              />
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
};

SlashTCContainer.propTypes = {
  profile: PT.shape(),
};

function mapStateToProps(state) {
  const profile = state.auth && state.auth.profile ? { ...state.auth.profile } : {};
  return {
    profile,
  };
}

export default connect(
  mapStateToProps,
)(SlashTCContainer);
