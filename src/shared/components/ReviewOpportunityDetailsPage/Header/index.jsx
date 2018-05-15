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
const Header = ({
  details, handle, onApply, phasesExpanded, onPhaseExpand,
}) => (
  <div styleName="container">
    <PaymentInfo
      positions={openPositionsByRole(details)}
    />
    <PhaseList
      isExpanded={phasesExpanded}
      onExpand={onPhaseExpand}
      phases={details.challenge.phases}
    />
    <ApplyTime
      openPositions={details.openPositions}
      onApply={onApply}
      hasApplied={Boolean(_.find(details.applications, app => app.handle === handle && app.status !== 'Cancelled'))}
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
  onApply: PT.func.isRequired,
  onPhaseExpand: PT.func.isRequired,
  phasesExpanded: PT.bool.isRequired,
};

export default Header;
