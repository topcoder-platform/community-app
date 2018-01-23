/**
 * Shows a list of challenge phases with corresponding times
 */
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';

import { Button } from 'components/buttons';

import style from './styles.scss';

/**
 * Renders a single phase based on the supplied phase data
 *
 * @param {Object} phase Object containing the phase data
 * @return {Object} The rendered React element
 */
const renderPhase = phase => (
  <div key={phase.type} styleName={moment().isBetween(phase.scheduledStartTime, phase.scheduledEndTime) ? 'active-phase' : 'inactive-phase'}>
    <div styleName="type">
      {phase.type}
    </div>
    <div styleName="date">
      <strong>{moment(phase.scheduledStartTime).format('MMM DD')}</strong>, {moment(phase.scheduledStartTime).format('hh:mma')}
    </div>
  </div>
);

/**
 * PhaseList Component
 */
const PhaseList = ({ isExpanded, phases, toggleExpand }) => (
  <div styleName={`container ${isExpanded ? 'expanded' : ''}`}>
    <div styleName="phases">
      {
        isExpanded ? phases.map(renderPhase) : phases.slice(0, 4).map(renderPhase)
      }
    </div>
    <Button onClick={toggleExpand} theme={style}>{isExpanded ? 'Hide Phase' : 'View All Phase \u2228'}</Button>
  </div>
);

/**
 * Prop Validation
 */
PhaseList.propTypes = {
  isExpanded: PT.bool.isRequired,
  phases: PT.arrayOf(PT.shape()).isRequired,
  toggleExpand: PT.func.isRequired,
};

export default PhaseList;
