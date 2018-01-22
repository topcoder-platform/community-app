/**
 * Description:
 *   Top-level component for the Review Opportunity Details page
 */
import React from 'react';
import PT from 'prop-types';

import './styles.scss';

/**
 * ReviewOpportunityDetailsPage Component
 */
const ReviewOpportunityDetailsPage = props => (
  <div styleName="container">
    <div styleName="content">
      Review Opportunity for challenge {props.challengeId}
    </div>
  </div>
);

/**
 * Prop Validation
 */
ReviewOpportunityDetailsPage.propTypes = {
  challengeId: PT.number.isRequired,
};

export default ReviewOpportunityDetailsPage;
