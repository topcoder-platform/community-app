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
  <div key={`phase-${phase.name}`} styleName={moment().isBetween(phase.scheduledStartDate, phase.scheduledEndDate) ? 'active-phase' : 'inactive-phase'}>
    <div styleName="type">
      {phase.name}
    </div>
    <div styleName="date">
      <strong>
        {moment(phase.scheduledStartDate).format('MMM DD')}
      </strong>
      ,
      {moment(phase.scheduledStartDate).format('hh:mma')}
    </div>
    <div styleName="duration">
      {formatDuration(moment(phase.scheduledEndDate) - moment(phase.scheduledStartDate))}
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
        isExpanded || phases.length < 6
          ? phases.map(renderPhase) : phases.slice(0, 4).map(renderPhase)
      }
    </div>
    {
      phases.length > 5 && (
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
      )
    }
  </div>
);

PhaseList.defaultProps = {
  phases: [],
};

PhaseList.propTypes = {
  isExpanded: PT.bool.isRequired,
  onExpand: PT.func.isRequired,
  phases: PT.arrayOf(PT.shape()),
};

export default PhaseList;
