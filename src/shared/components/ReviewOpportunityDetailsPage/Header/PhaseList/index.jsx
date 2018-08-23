/**
 * Shows a list of challenge phases with corresponding times
 */
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';
import { Button } from 'topcoder-react-ui-kit';

import { time } from 'topcoder-react-lib';

import ArrowUp from 'assets/images/icon-arrow-up.svg';
import ArrowDown from 'assets/images/icon-arrow-down.svg';

import style from './styles.scss';

const { formatDuration } = time;

/**
 * Renders a single phase based on the supplied phase data
 *
 * @param {Object} phase Object containing the phase data
 * @return {Object} The rendered React element
 */
const renderPhase = phase => (
  <div key={`phase-${phase.type}`} styleName={moment().isBetween(phase.scheduledStartTime, phase.scheduledEndTime) ? 'active-phase' : 'inactive-phase'}>
    <div styleName="type">
      {phase.type}
    </div>
    <div styleName="date">
      <strong>
        {moment(phase.scheduledStartTime).format('MMM DD')}
      </strong>
,
      {moment(phase.scheduledStartTime).format('hh:mma')}
    </div>
    <div styleName="duration">
      {formatDuration(moment(phase.scheduledEndTime) - moment(phase.scheduledStartTime))}
    </div>
  </div>
);

/**
 * PhaseList Component
 */
const PhaseList = ({ isExpanded, phases, onExpand }) => (
  <div
    style={{
      height: isExpanded ? `${(phases.length * 30) + 80}px` : 'auto',
    }}
    styleName={`container ${isExpanded ? 'expanded' : ''}`}
  >
    <div styleName="phases">
      {
        isExpanded ? phases.map(renderPhase) : phases.slice(0, 4).map(renderPhase)
      }
    </div>
    <Button onClick={onExpand} theme={style}>
      {isExpanded ? (
        <span>
Hide Phases
          <ArrowUp />
        </span>
      ) : (
        <span>
View All Phases
          <ArrowDown />
        </span>
      )}
    </Button>
  </div>
);

/**
 * Prop Validation
 */
PhaseList.propTypes = {
  isExpanded: PT.bool.isRequired,
  onExpand: PT.func.isRequired,
  phases: PT.arrayOf(PT.shape()).isRequired,
};

export default PhaseList;
