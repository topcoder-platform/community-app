/**
 * SlashTC index container
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Viewport from 'components/Contentful/Viewport';
import LoadingIndicator from 'components/LoadingIndicator';
import TopcoderTime from 'components/SlashTC/TCTime';
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
          <Viewport id="6sjlJHboX3aG3mFS5FnZND" />
        </div>
        {/* Center column */}
        <div className={theme.column}>
          <Viewport id="1BK50OyMT29IOavUC7wSEB" />
        </div>
        {/* Right column */}
        <div className={theme.column}>
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
