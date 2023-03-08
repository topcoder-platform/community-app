import moment from 'moment';
import _ from 'lodash';
/**
 * Progress Bar Tooltip.
 *
 * It renders the tooltip with detailed timeline of a specified challenge.
 * As TC API v2 does not provide all necessary information for some types of
 * challenges, this component does not work perfect yet.
 * Component updated to use TC API v3 api.
 *
 * USAGE:
 * Wrap with <ProgressBarTooltip></ProgressBarTooltip> the element(s) which should
 * show the tooltip when hovered. Pass in the challenge details object via the
 * 'challenge' prop.
 */

import React from 'react';
import PT from 'prop-types';
import Tooltip from 'components/Tooltip';
import { phaseStartDate, phaseEndDate } from 'utils/challenge-listing/helper';
import LoaderIcon from '../../../Loader/Loader';
import './style.scss';

const getDate = date => moment(date).format('MMM DD');
const getTime = (date) => {
  const duration = moment(date);
  const hour = duration.hours();
  const hString = hour < 10 ? `0${hour}` : hour;
  const min = duration.minutes();
  const mString = min < 10 ? `0${min}` : min;
  const res = `${hString}:${mString}`;
  return res[1] === '-' ? 'Late' : `${res}`;
};

/**
 * Renders a separate challenge phase element.
 * It includes: phase name, starting date, the point, representing the starting
 * date, the bar with inner-bar, representing the progress.
 * @param {Date} props.date Starting date of the phase.
 * @param {Boolean} props.last If true, the 'last' class will be added to the progress
 *  bar, allowing to hide it for the last phase element, which represent the end point
 *  of the challenge.
 * @param {String} props.phase Name of the phase.
 * @param {String} props.progress The progress of the phase. It will set the width
 *  of the colored part of the progress bar.
 * @param {Boolean} props.started When true, the 'started' class is added to the
 *  progress bar, allowing to color the point at its start.
 * @param {String} props.width The width of the phase element in the UI.
 */
function Phase({
  date,
  isLoaded,
  last,
  phase,
  progress,
  started,
}) {
  const limitProgress = parseFloat(_.replace(progress, '%', ''));
  const limitWidth = limitProgress <= 100 ? limitProgress : 100;

  return (
    <div styleName="phase">
      <div>
        {phase}
      </div>
      <div styleName={`bar ${last ? 'last' : ''} ${started ? 'started' : ''}`}>
        <div styleName="point" />
        <div styleName="inner-bar" style={{ width: `${limitWidth}%` }} />
      </div>
      <div styleName="date">
        {isLoaded ? `${getDate(date)}, ${getTime(date)}` : <LoaderIcon type="small" />}
      </div>
    </div>
  );
}

Phase.defaultProps = {
  isLoaded: false,
};

Phase.propTypes = {
  date: PT.shape({}).isRequired,
  last: PT.bool.isRequired,
  phase: PT.string.isRequired,
  progress: PT.string.isRequired,
  started: PT.bool.isRequired,
  isLoaded: PT.bool,
};

/**
 * Renders the tooltip's content.
 */
function Tip(props) {
  let steps = [];
  const { challenge: c } = props;
  const { isLoaded } = props;
  if (!c || _.isEmpty(c)) return <div />;

  const allPhases = c.phases || [];
  const endPhaseDate = Math.max(...allPhases.map(d => phaseEndDate(d)));
  const registrationPhase = allPhases.find(phase => phase.name === 'Registration') || {};
  const submissionPhase = allPhases.find(phase => phase.name === 'Submission') || {};
  const checkpointPhase = allPhases.find(phase => phase.name === 'Checkpoint Submission') || {};

  if (!_.isEmpty(registrationPhase)) {
    steps.push({
      date: phaseStartDate(registrationPhase),
      name: 'Start',
    });
  }
  if (!_.isEmpty(checkpointPhase)) {
    steps.push({
      date: phaseEndDate(checkpointPhase),
      name: 'Checkpoint',
    });
  }
  const iterativeReviewPhase = allPhases.find(phase => phase.isOpen && phase.name === 'Iterative Review');
  if (iterativeReviewPhase) {
    steps.push({
      date: phaseEndDate(iterativeReviewPhase),
      name: 'Iterative Review',
    });
  } else if (!_.isEmpty(submissionPhase)) {
    steps.push({
      date: phaseEndDate(submissionPhase),
      name: 'Submission',
    });
  }
  steps.push({
    date: new Date(endPhaseDate),
    name: 'End',
  });

  steps = steps.sort((a, b) => a.date.getTime() - b.date.getTime());
  const currentPhaseEnd = new Date();
  steps = steps.map((step, index) => {
    let progress = 0;
    if (index < steps.length - 1) {
      if (steps[1 + index].date.getTime() < currentPhaseEnd.getTime()) progress = 100;
      else if (step.date.getTime() > currentPhaseEnd.getTime()) progress = 0;
      else {
        const left = (currentPhaseEnd.getTime() - step.date.getTime());
        if (left < 0) progress = -1;
        else {
          progress = 100 * (left / (steps[1 + index].date.getTime() - steps[index].date.getTime()));
        }
      }
    }

    const phaseId = index;
    return (
      <Phase
        date={step.date}
        key={phaseId}
        last={index === steps.length - 1}
        phase={step.name}
        progress={`${progress}%`}
        started={step.date.getTime() < currentPhaseEnd.getTime()}
        isLoaded={isLoaded}
      />
    );
  });

  return (
    <div styleName="progress-bar-tooltip">
      <div styleName="tip">
        {steps}
      </div>
    </div>
  );
}

Tip.defaultProps = {
  isLoaded: false,
};

Tip.propTypes = {
  challenge: PT.object.isRequired,
  isLoaded: PT.bool,
};

/** Handles arrow placement of the Progressbar tooltip
 *  because rc-tooltip doesnot display arrow correctly
 *  for progressbar tooltip out of the box.
 */
function placeArrow(TooltipNode) {
  const toolTip = TooltipNode;
  const arrow = TooltipNode.querySelector('.rc-tooltip-arrow');
  const rootTopOffset = this.getRootDomNode().getBoundingClientRect().top;
  const tooltipTopOffset = TooltipNode.getBoundingClientRect().top;

  if (rootTopOffset < tooltipTopOffset) {
    toolTip.style.top = `${parseInt(toolTip.style.top, 10) - 20}px`;
    arrow.style.top = '-5px';
  }
}

/**
 * Renders the tooltip.
 */
class ProgressBarTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chDetails: {},
    };
    this.onTooltipHover = this.onTooltipHover.bind(this);
  }

  onTooltipHover() {
    const { challenge } = this.props;
    const chDetails = _.clone(challenge);
    this.setState({
      chDetails,
    });
  }

  render() {
    const { children } = this.props;
    const { chDetails } = this.state;
    const tip = <Tip challenge={chDetails} isLoaded />;
    return (
      <Tooltip
        className="progress-bar-tooltip"
        content={tip}
        align={{
          offset: [0, -15],
        }}
        onTooltipHover={this.onTooltipHover}
        placeArrow={placeArrow}
      >
        {children}
      </Tooltip>
    );
  }
}
ProgressBarTooltip.defaultProps = {
  challenge: {},
};

ProgressBarTooltip.propTypes = {
  challenge: PT.shape({}),
  children: PT.node.isRequired,
};

export default ProgressBarTooltip;
