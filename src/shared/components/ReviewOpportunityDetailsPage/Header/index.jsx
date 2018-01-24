/**
 * Header which displays review payment, challenge phases, and provides an application button
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { openPositionsByRole } from 'utils/reviewOpportunities';

import ApplyTime from './ApplyTime';
import PaymentInfo from './PaymentInfo';
import PhaseList from './PhaseList';

import './styles.scss';

/**
 * Header Component
 */
const Header = ({ details, handle, phasesExpanded, togglePhasesExpand }) => (
  <div styleName="container">
    <PaymentInfo
      positions={openPositionsByRole(details)}
    />
    <PhaseList
      isExpanded={phasesExpanded}
      phases={details.challenge.phases}
      toggleExpand={togglePhasesExpand}
    />
    <ApplyTime
      openPositions={details.openPositions}
      hasApplied={Boolean(_.find(details.applications, app => app.handle === handle))}
      startDate={details.startDate}
    />
  </div>
);

/**
 * Prop Validation
 */
Header.propTypes = {
  details: PT.shape().isRequired,
  handle: PT.string.isRequired,
  phasesExpanded: PT.bool.isRequired,
  togglePhasesExpand: PT.func.isRequired,
};

export default Header;
