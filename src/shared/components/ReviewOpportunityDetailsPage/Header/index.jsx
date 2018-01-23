/**
 * Header which displays review payment, challenge phases, and provides an application button
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import ApplyTime from './ApplyTime';
import PhaseList from './PhaseList';

import './styles.scss';

/**
 * Header Component
 */
const Header = ({ details, handle, phasesExpanded, togglePhasesExpand }) => (
  <div styleName="container">
    <ApplyTime
      openPositions={details.openPositions}
      hasApplied={Boolean(_.find(details.applications, app => app.handle === handle))}
      startDate={details.startDate}
    />
    <PhaseList
      isExpanded={phasesExpanded}
      phases={details.challenge.phases}
      toggleExpand={togglePhasesExpand}
    />
  </div>
);

/**
 * Default values for Props
 */
Header.defaultProps = {
};

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
