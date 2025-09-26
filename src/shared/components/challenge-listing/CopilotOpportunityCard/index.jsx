/**
 * Component for rendering a Copilot Opportunity Card which will serve as a row in the list.
 */
import _ from 'lodash';
import { config } from 'topcoder-react-utils';
import moment from 'moment';
import React, { useMemo } from 'react';
import PT from 'prop-types';

import Tags from '../Tags';

import './style.scss';

const PROJECT_TYPE_LABELS = {
  dev: 'Development',
  ai: 'AI (Artificial Intelligence)',
  design: 'Design',
  datascience: 'Data Science',
  qa: 'Quality Assurance',
};

function CopilotOpportunityCard({
  opportunity,
}) {
  const skills = useMemo(() => _.uniq((opportunity.skills || []).map(skill => skill.name)), [
    opportunity.skills,
  ]);
  const start = moment(opportunity.startDate);

  let statusClass = '';
  if (opportunity.status === 'completed') {
    statusClass = 'completed';
  } else if (opportunity.status === 'canceled') {
    statusClass = 'canceled';
  }


  return (
    <div styleName="copilotOpportunityCard">
      <div styleName="left-panel">

        <div styleName="challenge-details">
          <a
            href={`${config.URL.COPILOTS_URL}/opportunity/${opportunity.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {opportunity.opportunityTitle}
          </a>

          <div styleName="details-footer">
            <span styleName="date">
              Starts {start.format('MMM DD')}
            </span>
            { skills.length > 0
              && (
              <Tags
                skills={skills}
              />
              ) }
          </div>
        </div>
      </div>

      <div styleName="right-panel">
        <div styleName="type">
          <span>{PROJECT_TYPE_LABELS[opportunity.type]}</span>
        </div>
        <div styleName={`status ${statusClass}`}>
          <span>{opportunity.status}</span>
        </div>
        <div styleName="numHours">
          <span>{opportunity.numHoursPerWeek} hours/week</span>
        </div>
      </div>
    </div>
  );
}

CopilotOpportunityCard.propTypes = {
  opportunity: PT.shape().isRequired,
};

export default CopilotOpportunityCard;
