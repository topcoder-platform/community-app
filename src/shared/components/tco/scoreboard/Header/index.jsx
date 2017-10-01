/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Scoreboard header component.
 * This component renders all other child components part of the header.
 * Any data massaging needed for a child view should be done here.
 */

import React from 'react';
import PT from 'prop-types';
import { ThemeProvider } from 'react-css-super-themr';

import './style.scss';

export default function ScoreboardChallengeHeader(props) {
  const {
    challenge,
  } = props;

  const {
    type,
    title,
    description,
  } = challenge || {};

  return (
    <ThemeProvider>
      <div styleName="challenge-outer-container">
        <div styleName="important-detail">
          <h1 styleName="challenge-header">{title}</h1>
          <p>[{type}]</p>
          <h3>{description}</h3>
        </div>
      </div>
    </ThemeProvider>
  );
}

ScoreboardChallengeHeader.propTypes = {
  challenge: PT.shape({
    id: PT.number,
  }).isRequired,
};
