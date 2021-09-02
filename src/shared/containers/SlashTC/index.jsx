/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */
/**
 * SlashTC index container
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Viewport from 'components/Contentful/Viewport';
import TopcoderTime from 'components/SlashTC/TCTime';
import ThriveArticlesFeedContainer from 'containers/Dashboard/ThriveArticlesFeed';
import GigsFeed from 'containers/Dashboard/GigsFeed';
import TCOLeaderboardsContainer from 'containers/Dashboard/TCOLeaderboards';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import NewsFeed from './NewsFeed';
import darkTheme from './themes/dark.scss';

const THEMES = {
  dark: darkTheme,
};

function SlashTCContainer(props) {
  const theme = THEMES.dark; // for v1 only dark theme
  return (
    <div className={theme.container}>
      <div className={theme.layoutWrapper}>
        {/* Left column */}
        <div className={theme.column}>
          <TopcoderTime />
          <ThriveArticlesFeedContainer itemCount={5} theme="dark" />
          <Viewport id="6sjlJHboX3aG3mFS5FnZND" />
        </div>
        {/* Center column */}
        <div className={theme.column}>
          <Viewport id="1BK50OyMT29IOavUC7wSEB" />
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
          {/* <TCOLeaderboardsContainer
            trackConfig={trackConfig}
            itemCount={5}
          /> */}
          <Viewport id="SSwOFPT8l0WpGhqCBRISG" />
        </div>
      </div>
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
