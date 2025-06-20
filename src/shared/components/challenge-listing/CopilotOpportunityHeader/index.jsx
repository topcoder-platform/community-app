/**
 * Component for rendering a Copilot Opportunity and associated Challenge
 * information. Will be contained within a Bucket.
 */
import React from 'react';
import './style.scss';

function CopilotOpportunityHeader() {
  return (
    <div styleName="copilotOpportunityHeader">
      <div styleName="left-panel">

        <div styleName="challenge-details">
          Opportunity Name
        </div>
      </div>

      <div styleName="right-panel">
        <div styleName="type">
          <span>Type</span>
        </div>
        <div styleName="status">
          <span>Status</span>
        </div>
        <div styleName="numHours">
          <span>Commitment</span>
        </div>
      </div>
    </div>
  );
}

export default CopilotOpportunityHeader;
