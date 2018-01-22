/**
 * Description:
 *   Top-level component for the Review Opportunity Details page
 */
import React from 'react';
import PT from 'prop-types';

import { TABS } from 'actions/page/review-opportunity-details';

import ChallengeSpecTab from './ChallengeSpecTab';

import './styles.scss';

/**
 * ReviewOpportunityDetailsPage Component
 */
const ReviewOpportunityDetailsPage = ({ details, selectTab, selectedTab }) => (
  <div styleName="outer-container">
    <div styleName="page">

      <div styleName="header">
        <h1 styleName="challenge-title">{details.challenge.title}</h1>
        <div styleName="tags">
          <div styleName="review-opportunity-tag">Review Opportunities</div>
          <div styleName="subtrack-tag">{details.challenge.subTrack}</div>
        </div>
        <div styleName="tabs">
          <div styleName={`tab ${selectedTab === TABS.APPLICATIONS ? 'selected-tab' : ''}`}>
            <a onClick={() => selectTab(TABS.APPLICATIONS)} role="link" tabIndex="0">REVIEW APPLICATIONS</a>
          </div>
          <div styleName={`tab ${selectedTab === TABS.CHALLENGE_SPEC ? 'selected-tab' : ''}`}>
            <a onClick={() => selectTab(TABS.CHALLENGE_SPEC)} role="link" tabIndex="-1">CHALLENGE SPEC</a>
          </div>
          <div styleName="tab">
            <a href="https://help.topcoder.com/hc/en-us/articles/222503827-Development-Reviewer-Role-Responsibilities" target="_blank" rel="noopener noreferrer">REVIEW PROCESS AND RULES</a>
          </div>
        </div>
      </div>

      { selectedTab === TABS.CHALLENGE_SPEC ?
        <ChallengeSpecTab challenge={details.challenge} /> : null }

    </div>
  </div>
);

/**
 * Default values for Props
 */
ReviewOpportunityDetailsPage.defaultProps = {
  selectedTab: TABS.APPLICATIONS,
};

/**
 * Prop Validation
 */
ReviewOpportunityDetailsPage.propTypes = {
  details: PT.shape().isRequired,
  selectTab: PT.func.isRequired,
  selectedTab: PT.string,
};

export default ReviewOpportunityDetailsPage;
