/**
 * Tab that will display a simple render of the Challenge Specs
 */
import React from 'react';
import PT from 'prop-types';
import MarkdownRenderer from 'components/MarkdownRenderer';

import './styles.scss';

/**
 * ChallengeSpecTab Component
 */
const ChallengeSpecTab = ({ challenge }) => (
  <div styleName="container">
    {
      challenge.description
      && (
      <article>
        <h2 styleName="h2">
          Challenge Overview
        </h2>
        <div
          styleName="rawHtml"
        >
          <MarkdownRenderer markdown={challenge.description} />
        </div>
      </article>
      )
    }
  </div>
);

/**
 * Prop Validation
 */
ChallengeSpecTab.propTypes = {
  challenge: PT.shape().isRequired,
};

export default ChallengeSpecTab;
