/* global
  Math
*/

/**
 *  The component displays a challenge card without any data.
 *  The empty data is replaced with grey background.
 */

import React from 'react';
import PT from 'prop-types';
import '../../ChallengeCard/style.scss';

const ChallengeCardPlaceholder = ({ id }) => (
  <div styleName="challengeCard placeholder" key={id}>
    <div styleName="left-panel">
      <div styleName="challenge-track placeholder-template" />

      <div styleName="challenge-details">
        <div styleName="challenge-title placeholder-template" />
        <div styleName="details-footer placeholder-template footer-template" />
      </div>
    </div>
    <div styleName="right-panel">
      <div styleName="prizes placeholder-template" />

      <div styleName="challenge-status">
        <div styleName="progress-container placeholder-template" />

        <div styleName="challenge-stats-container">
          <div styleName="challenge-stats placeholder-template" />
        </div>
      </div>
    </div>
  </div>
);

ChallengeCardPlaceholder.defaultProps = {
  id: 0,
};

ChallengeCardPlaceholder.propTypes = {
  id: PT.oneOfType([PT.string, PT.number]),
};

export default ChallengeCardPlaceholder;
