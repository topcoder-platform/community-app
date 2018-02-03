/**
 * Shows a list of challenge phases with corresponding times
 */
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';

import { Button } from 'components/buttons';
import Tooltip from 'components/Tooltip';

import ArrowUp from 'assets/images/icon-arrow-up.svg';
import ArrowDown from 'assets/images/icon-arrow-down.svg';

import style from './styles.scss';

/**
 * Renders the phase tooltip
 *
 * @param {Object} phase Object containing the phase data
 * @return {Object} The rendered React element
 */
const renderTooltip = (phase) => {
  const start = moment(phase.actualStartTime || phase.scheduledStartTime);
  const end = moment(phase.actualEndTime || phase.scheduledEndTime);
  const now = moment();

  let progress;
  if (start.isAfter(now)) {
    progress = 0;
  } else if (end.isBefore(now)) {
    progress = 100;
  } else {
    progress = ((now - start) / (end - start)) * 100;
  }

  return (
    <div styleName="tooltip-container">
      <div styleName="tip">
        <div styleName="phase">
          <div>Start</div>
          <div styleName={`bar ${progress ? 'started' : ''}`}>
            <div styleName="point" />
            <div styleName="inner-bar" style={{ width: `${progress}%` }} />
          </div>
          <div styleName="date">
            { start.format('MMM DD, hh:mma') }
          </div>
        </div>
        <div styleName="phase">
          <div>End</div>
          <div styleName="bar last">
            <div styleName="point" />
            <div styleName="inner-bar" style={{ width: `${progress}%` }} />
          </div>
          <div styleName="date">
            { end.format('MMM DD, hh:mma') }
          </div>
        </div>
        <div styleName="duration">
          Duration
          <div styleName="hours">{end.diff(start, 'hours')}h</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Renders a single phase based on the supplied phase data
 *
 * @param {Object} phase Object containing the phase data
 * @return {Object} The rendered React element
 */
const renderPhase = phase => (
  <Tooltip key={phase.type} className="review-opportunity-details-tooltip" content={renderTooltip(phase)} suppressDiv>
    <div styleName={moment().isBetween(phase.scheduledStartTime, phase.scheduledEndTime) ? 'active-phase' : 'inactive-phase'}>
      <div styleName="type">
        {phase.type}
      </div>
      <div styleName="date">
        <strong>{moment(phase.scheduledStartTime).format('MMM DD')}</strong>, {moment(phase.scheduledStartTime).format('hh:mma')}
      </div>
    </div>
  </Tooltip>
);

/**
 * PhaseList Component
 */
const PhaseList = ({ isExpanded, phases, onExpand }) => (
  <div styleName={`container ${isExpanded ? 'expanded' : ''}`}>
    <div styleName="phases">
      {
        isExpanded ? phases.map(renderPhase) : phases.slice(0, 4).map(renderPhase)
      }
    </div>
    <Button onClick={onExpand} theme={style}>
      {isExpanded ? <span>Hide Phases<ArrowUp /></span> : <span>View All Phases<ArrowDown /></span>}
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
