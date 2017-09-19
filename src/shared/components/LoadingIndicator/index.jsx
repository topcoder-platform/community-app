/**
 * Waiting indicator: two co-centric circles periodically increasing their
 * radiuses till maximum value, then resetting it to zero.
 *
 * NOTE: It is implemented as class component because stand-alone animated SVG
 * images are not well supported across all browsers yet.
 */

/* global window */

import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';
import style from './styles.scss';

class LoadingIndicator extends React.Component {
  /**
   * Calculates animation phase for the specified timestamp.
   * @param {Number} timestamp Current animation time in [ms].
   * @param {Number} shift Optional phase shift [dimensionless].
   * @return {Number} Returns animation phase: a number in [0.0; 1.0] range,
   *  specifying current position inside animation loop. You may note that
   *  the result does not change linearly with time, instead it goes quadratic
   *  in a way that makes animation progress faster in the beginning, and
   *  slower in the end of a cycle.
   */
  static calcPhase(timestamp, shift = 0) {
    const PERIOD = 2; /* [s] */
    return ((timestamp / 1000 / PERIOD) + shift) % 1;
  }

  componentDidMount() {
    this.animationId = window.requestAnimationFrame(ts => this.animation(ts));
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationId);
  }

  /* Moves animation forward. */
  animation(timestamp) {
    if (this.circle1) {
      const phase1 = LoadingIndicator.calcPhase(timestamp);
      this.circle1.setAttribute('r', 28 * phase1 * (2.0 - phase1));
      this.circle1.setAttribute('opacity', 1.0 - (phase1 * phase1));
    }
    if (this.circle2) {
      const phase2 = LoadingIndicator.calcPhase(timestamp, 0.5);
      this.circle2.setAttribute('r', 28 * phase2 * (2.0 - phase2));
      this.circle2.setAttribute('opacity', 1.0 - (phase2 * phase2));
    }
    this.animationId = window.requestAnimationFrame(ts => this.animation(ts));
  }

  render() {
    const { theme } = this.props;
    return (
      <svg
        className={theme.container}
        viewBox="0 0 64 64"
      >
        <circle
          className={theme.circle1}
          cx="32"
          cy="32"
          r="28"
          ref={(node) => { this.circle1 = node; }}
        />
        <circle
          className={theme.circle2}
          cx="32"
          cy="32"
          r="6"
          ref={(node) => { this.circle2 = node; }}
        />
      </svg>
    );
  }
}

LoadingIndicator.propTypes = {
  theme: PT.shape().isRequired,
};

export default themr('LoadingIndicator', style)(LoadingIndicator);
