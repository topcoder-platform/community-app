/**
 * Description:
 *   Top-level component for the Review Opportunity Details page
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { TABS } from 'actions/page/review-opportunity-details';
import Terms from 'containers/Terms';

import ApplyModal from './ApplyModal';
import ApplicationsTab from './ApplicationsTab';
import ChallengeSpecTab from './ChallengeSpecTab';
import Header from './Header';
import Sidebar from './Sidebar';

import './styles.scss';

/**
 * ReviewOpportunityDetailsPage Component
 */
const ReviewOpportunityDetailsPage = ({
  applyModalOpened,
  details,
  handle,
  phasesExpanded,
  onHeaderApply,
  onModalApply,
  onPhaseExpand,
  requiredTerms,
  selectedRoles,
  setRoles,
  selectTab,
  selectedTab,
  terms,
  toggleApplyModal,
  toggleRole,
}) => (
  <div styleName="outer-container">
    <div styleName="page" role="main">

      <div styleName="header">
        <h1 styleName="challenge-title">
          {details.challenge.name}
        </h1>
        <div styleName="tags">
          <div styleName="review-opportunity-tag">
            Review Opportunities
          </div>
          <div styleName="subtrack-tag">
            {details.challenge.type}
          </div>
        </div>

        <Header
          details={details}
          handle={handle}
          onApply={onHeaderApply}
          onPhaseExpand={onPhaseExpand}
          phasesExpanded={phasesExpanded}
        />

        <div styleName="tabs">
          <div styleName={`tab ${selectedTab === TABS.APPLICATIONS ? 'selected-tab' : ''}`}>
            <a
              onClick={() => selectTab(TABS.APPLICATIONS)}
              onKeyPress={() => selectTab(TABS.APPLICATIONS)}
              role="link"
              tabIndex="0"
            >
              REVIEW APPLICATIONS
              {' '}
              {`(${details.applications ? details.applications.filter(app => app.status !== 'CANCELLED').length : 0})`}
            </a>
          </div>
          <div styleName={`tab ${selectedTab === TABS.CHALLENGE_SPEC ? 'selected-tab' : ''}`}>
            <a
              onClick={() => selectTab(TABS.CHALLENGE_SPEC)}
              onKeyPress={() => selectTab(TABS.CHALLENGE_SPEC)}
              role="link"
              tabIndex="-1"
            >
              CHALLENGE SPEC
            </a>
          </div>
          <div styleName="tab">
            <a href="https://www.topcoder.com/thrive/articles/Development%20Review%20-%20Role%20&%20Responsibilities" target="_blank" rel="noopener noreferrer">
              REVIEW PROCESS AND RULES
            </a>
          </div>
        </div>
      </div>

      <div styleName="tab-container">
        {
          selectedTab === TABS.APPLICATIONS
            ? <ApplicationsTab applications={details.applications} /> : null
        }
        {
          selectedTab === TABS.CHALLENGE_SPEC
            ? <ChallengeSpecTab challenge={details.challenge} /> : null
        }
        <Sidebar terms={_.isEmpty(terms) ? requiredTerms : terms} />
      </div>

    </div>
    <Terms
      defaultTitle="Topcoder Reviewer Terms & Conditions"
      entity={{ type: 'reviewOpportunity', id: details.id.toString(), reviewOpportunityTerms: requiredTerms }}
      description="You are seeing these Terms & Conditions of Use because you have registered to a challenge and you have to respect the terms below in order to be able to submit."
      register={onHeaderApply}
    />
    {
      applyModalOpened
      && (
      <ApplyModal
        details={details}
        handle={handle}
        onApply={onModalApply}
        onCancel={toggleApplyModal}
        selectedRoles={selectedRoles}
        setRoles={setRoles}
        toggleRole={toggleRole}
      />
      )
    }
  </div>
);

/**
 * Default values for Props
 */
ReviewOpportunityDetailsPage.defaultProps = {
  applyModalOpened: false,
  selectedTab: TABS.APPLICATIONS,
};

/**
 * Prop Validation
 */
ReviewOpportunityDetailsPage.propTypes = {
  applyModalOpened: PT.bool,
  details: PT.shape().isRequired,
  handle: PT.string.isRequired,
  onHeaderApply: PT.func.isRequired,
  onModalApply: PT.func.isRequired,
  onPhaseExpand: PT.func.isRequired,
  toggleApplyModal: PT.func.isRequired,
  phasesExpanded: PT.bool.isRequired,
  requiredTerms: PT.arrayOf(PT.shape()).isRequired,
  selectedRoles: PT.arrayOf(PT.number).isRequired,
  selectTab: PT.func.isRequired,
  selectedTab: PT.string,
  setRoles: PT.func.isRequired,
  terms: PT.arrayOf(PT.shape()).isRequired,
  toggleRole: PT.func.isRequired,
};

export default ReviewOpportunityDetailsPage;
