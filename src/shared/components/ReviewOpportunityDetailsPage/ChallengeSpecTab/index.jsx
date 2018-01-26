/**
 * Tab that will display a simple render of the Challenge Specs
 */
import React from 'react';
import PT from 'prop-types';

import './styles.scss';

/**
 * ChallengeSpecTab Component
 */
const ChallengeSpecTab = ({ challenge }) => (
  <div styleName="container">
    {
      challenge.detailedRequirements &&
      <article>
        <h2 styleName="h2">Challenge Overview</h2>
        <div
          /* eslint-disable react/no-danger */
          dangerouslySetInnerHTML={{
            __html: challenge.detailedRequirements,
          }}
          /* eslint-enable react/no-danger */
          styleName="rawHtml"
        />
      </article>
    }
    {
      challenge.finalSubmissionGuidelines &&
      <article>
        <h2 styleName="h2">Final Submission Guidelines</h2>
        <div
          /* eslint-disable react/no-danger */
          dangerouslySetInnerHTML={{
            __html: challenge.finalSubmissionGuidelines,
          }}
          /* eslint-enable react/no-danger */
          styleName="rawHtml"
        />
      </article>
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
