/**
 * Waiting indicator: two co-centric circles periodically increasing their
 * radiuses till maximum value, then resetting it to zero.
 *
 * Animation is done via a client-side script found in client/loading-indicator-animation
 */

import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';
import style from './styles.scss';

const LoadingIndicator = ({ theme }) => (
  <svg
    className={theme.container}
    viewBox="0 0 64 64"
  >
    <circle
      className={theme.circle1}
      cx="32"
      cy="32"
      r="28"
      id="loading-indicator-circle1"
    />
    <circle
      className={theme.circle2}
      cx="32"
      cy="32"
      r="6"
      id="loading-indicator-circle2"
    />
  </svg>
);

LoadingIndicator.propTypes = {
  theme: PT.shape().isRequired,
};

export default themr('LoadingIndicator', style)(LoadingIndicator);
